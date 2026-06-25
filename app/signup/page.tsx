import Link from "next/link";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">Juris</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Start your free trial</h1>
          <p className="text-sm text-slate-500 mt-1">No credit card required · 14-day free trial</p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {["SOC 2", "256-bit SSL", "GDPR"].map((b) => (
            <div key={b} className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {b}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <SignupForm />
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By signing up, you agree to our{" "}
          <Link href="/pricing" className="underline hover:text-slate-600">Terms of Service</Link>
          {" "}and{" "}
          <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
