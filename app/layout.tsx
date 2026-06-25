import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Juris — AI Contract Review",
  description: "AI-powered contract review for law firms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-slate-900 tracking-tight">Juris</span>
              <span className="hidden sm:inline text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">Beta</span>
            </Link>
            <nav className="flex items-center gap-1">
              <span className="text-xs text-slate-500 hidden sm:block mr-2">Powered by Claude AI</span>
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                New Review
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-100 py-6 px-6">
          <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span>© 2026 Juris. AI-powered contract analysis.</span>
            <span>Files are encrypted in transit and never shared.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
