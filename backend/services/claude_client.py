import json
from typing import Optional
from groq import Groq
from ..config import settings
from ..schemas import ContractAnalysis, ClauseAnalysis

_client: Optional[Groq] = None

MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are a senior contract attorney specializing in commercial law.
Your task is to review contracts and identify key clauses, assess their risk level,
and suggest redline edits where necessary.

Risk levels:
- Red: High risk — clause is one-sided, missing critical protections, or exposes the client to significant liability
- Yellow: Medium risk — clause has issues but is negotiable or common in the industry
- Green: Low risk — clause is standard and acceptable

Focus on these clause types: indemnification, liability cap, termination, IP ownership,
payment terms, governing law, confidentiality, dispute resolution.

You MUST respond with a valid JSON object matching EXACTLY this schema:
{
  "summary": "<one-paragraph plain-English summary of key risks>",
  "overall_risk": "<Low|Medium|High>",
  "clauses": [
    {
      "clause_type": "<type>",
      "risk_level": "<Red|Yellow|Green>",
      "original_text": "<exact text from contract>",
      "reason": "<plain-English explanation of the risk>",
      "suggested_redline": "<replacement language, or 'No changes needed.' if Green>"
    }
  ]
}

Only include clauses that actually appear in the contract. Do not add any text outside the JSON object."""


def get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.groq_api_key)
    return _client


def analyze_contract(contract_text: str) -> ContractAnalysis:
    client = get_client()

    response = client.chat.completions.create(
        model=MODEL,
        response_format={"type": "json_object"},
        temperature=0,
        max_tokens=8192,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    "Please analyze the following contract and extract all key clauses:\n\n"
                    f"<contract>\n{contract_text}\n</contract>"
                ),
            },
        ],
    )

    raw = response.choices[0].message.content
    data = json.loads(raw)

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
