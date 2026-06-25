import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for solo practitioners and small firms getting started with AI contract review.",
    highlight: false,
    cta: "Start free trial",
    ctaHref: "/signup",
    features: [
      "25 contract reviews / month",
      "Clause extraction & risk scoring",
      "Plain-English summaries",
      "PDF & DOCX support",
      "Email support",
    ],
    notIncluded: [
      "Redline suggestions",
      "Team collaboration",
      "API access",
      "Dedicated account manager",
    ],
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    description: "For growing firms that need full AI-powered analysis with redline suggestions.",
    highlight: true,
    cta: "Start free trial",
    ctaHref: "/signup",
    badge: "Most popular",
    features: [
      "150 contract reviews / month",
      "Clause extraction & risk scoring",
      "Plain-English summaries",
      "PDF & DOCX support",
      "Redline suggestions",
      "Team collaboration (up to 5)",
      "Priority email & chat support",
    ],
    notIncluded: [
      "API access",
      "Dedicated account manager",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Unlimited reviews, API access, SSO, and a dedicated account team for large firms.",
    highlight: false,
    cta: "Contact sales",
    ctaHref: "mailto:sales@juris.ai",
    features: [
      "Unlimited contract reviews",
      "Clause extraction & risk scoring",
      "Plain-English summaries",
      "PDF & DOCX support",
      "Redline suggestions",
      "Unlimited team seats",
      "API access & webhooks",
      "SSO / SAML",
      "Dedicated account manager",
      "SLA & uptime guarantee",
    ],
    notIncluded: [],
  },
];

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes — every paid plan starts with a 14-day free trial. No credit card required to sign up.",
  },
  {
    q: "What counts as a contract review?",
    a: "Each file you upload counts as one review. A review includes clause extraction, risk scoring, plain-English summary, and (on Pro and above) redline suggestions.",
  },
  {
    q: "How accurate is the AI analysis?",
    a: "Juris is powered by Claude AI and achieves 99% clause detection accuracy on standard commercial contracts. We recommend treating output as a first-pass review, not a substitute for attorney judgment.",
  },
  {
    q: "Is my data secure?",
    a: "All files are encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC 2 Type II compliant and never use your data to train AI models.",
  },
  {
    q: "Can I upgrade or downgrade at any time?",
    a: "Yes. Plan changes take effect at the start of your next billing cycle. Unused reviews do not roll over.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex-1 px-4 py-16 max-w-6xl mx-auto w-full">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4 tracking-wide uppercase">
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Pay for reviews, not seats
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Start free for 14 days. No credit card required. Cancel any time.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-8 ${
              plan.highlight
                ? "border-indigo-500 shadow-lg shadow-indigo-100 bg-indigo-600 text-white"
                : "border-slate-200 bg-white text-slate-900 shadow-sm"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex px-3 py-1 rounded-full bg-indigo-500 border border-indigo-400 text-white text-xs font-bold shadow-sm">
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="mb-6">
              <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.highlight ? "text-indigo-200" : "text-indigo-600"}`}>
                {plan.name}
              </p>
              <div className="flex items-end gap-1 mb-3">
                <span className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`text-sm mb-1 ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}>
                    {plan.period}
                  </span>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${plan.highlight ? "text-indigo-100" : "text-slate-500"}`}>
                {plan.description}
              </p>
            </div>

            <Link
              href={plan.ctaHref}
              className={`block text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors mb-8 ${
                plan.highlight
                  ? "bg-white text-indigo-700 hover:bg-indigo-50"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {plan.cta}
            </Link>

            <ul className="space-y-2.5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <svg
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-indigo-200" : "text-emerald-500"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className={plan.highlight ? "text-indigo-50" : "text-slate-700"}>{f}</span>
                </li>
              ))}
              {plan.notIncluded.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <svg
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-indigo-400" : "text-slate-300"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className={plan.highlight ? "text-indigo-300" : "text-slate-400"}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Trust bar */}
      <div className="border-t border-b border-slate-100 py-8 mb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { stat: "500+", label: "Law firms" },
            { stat: "1M+", label: "Contracts reviewed" },
            { stat: "99%", label: "Clause accuracy" },
            { stat: "SOC 2", label: "Certified" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-2xl font-bold text-slate-900">{item.stat}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <p className="font-semibold text-slate-900 mb-2">{faq.q}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
          <h3 className="font-bold text-slate-900 mb-1">Still have questions?</h3>
          <p className="text-sm text-slate-500 mb-4">Our team is happy to walk you through the right plan for your firm.</p>
          <a
            href="mailto:sales@juris.ai"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Talk to sales
          </a>
        </div>
      </div>
    </div>
  );
}
