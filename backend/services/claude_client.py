import anthropic
from ..config import settings
from ..schemas import ContractAnalysis, ClauseAnalysis

_client: anthropic.Anthropic | None = None

CLAUSE_TYPES = [
    "indemnification",
    "liability cap",
    "termination",
    "IP ownership",
    "payment terms",
    "governing law",
    "confidentiality",
    "dispute resolution",
]

SYSTEM_PROMPT = """You are a senior contract attorney specializing in commercial law.
Your task is to review contracts and identify key clauses, assess their risk level,
and suggest redline edits where necessary.

Risk levels:
- Red: High risk — clause is one-sided, missing critical protections, or exposes the client to significant liability
- Yellow: Medium risk — clause has issues but is negotiable or common in the industry
- Green: Low risk — clause is standard and acceptable

Focus on these clause types: indemnification, liability cap, termination, IP ownership,
payment terms, governing law, confidentiality, dispute resolution.

Be thorough but precise. Only flag clauses that actually appear in the contract."""


def get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    return _client


EXTRACT_TOOL = {
    "name": "extract_contract_clauses",
    "description": (
        "Extract and analyze all key contract clauses. "
        "For each clause, classify its type, assess its risk level, "
        "quote the original text, explain the risk, and suggest a redline edit."
    ),
    "strict": True,
    "input_schema": {
        "type": "object",
        "properties": {
            "summary": {
                "type": "string",
                "description": "A plain-English one-paragraph summary of the contract's key risks for a client memo.",
            },
            "overall_risk": {
                "type": "string",
                "enum": ["Low", "Medium", "High"],
                "description": "Overall risk level of the contract.",
            },
            "clauses": {
                "type": "array",
                "description": "All identified key clauses.",
                "items": {
                    "type": "object",
                    "properties": {
                        "clause_type": {
                            "type": "string",
                            "description": (
                                "Type of clause: indemnification, liability cap, termination, "
                                "IP ownership, payment terms, governing law, confidentiality, "
                                "or dispute resolution."
                            ),
                        },
                        "risk_level": {
                            "type": "string",
                            "enum": ["Red", "Yellow", "Green"],
                        },
                        "original_text": {
                            "type": "string",
                            "description": "The exact text of the clause as it appears in the contract.",
                        },
                        "reason": {
                            "type": "string",
                            "description": "Plain-English explanation of why this clause has the assigned risk level.",
                        },
                        "suggested_redline": {
                            "type": "string",
                            "description": "Suggested replacement language to reduce risk. If Green, state 'No changes needed.'",
                        },
                    },
                    "required": ["clause_type", "risk_level", "original_text", "reason", "suggested_redline"],
                    "additionalProperties": False,
                },
            },
        },
        "required": ["summary", "overall_risk", "clauses"],
        "additionalProperties": False,
    },
}


def analyze_contract(contract_text: str) -> ContractAnalysis:
    client = get_client()

    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=8192,
        system=SYSTEM_PROMPT,
        tools=[EXTRACT_TOOL],
        tool_choice={"type": "tool", "name": "extract_contract_clauses"},
        messages=[
            {
                "role": "user",
                "content": (
                    f"Please analyze the following contract and extract all key clauses:\n\n"
                    f"<contract>\n{contract_text}\n</contract>"
                ),
            }
        ],
    ) as stream:
        message = stream.get_final_message()

    for block in message.content:
        if block.type == "tool_use" and block.name == "extract_contract_clauses":
            data = block.input
            return ContractAnalysis(
                summary=data["summary"],
                overall_risk=data["overall_risk"],
                clauses=[
                    ClauseAnalysis(
                        clause_type=c["clause_type"],
                        risk_level=c["risk_level"],
                        original_text=c["original_text"],
                        reason=c["reason"],
                        suggested_redline=c["suggested_redline"],
                    )
                    for c in data["clauses"]
                ],
            )

    raise RuntimeError("Claude did not return a tool_use block")
