import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-navy-950 font-semibold mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-3xl bg-white p-8 sm:p-12 border border-slate-200 shadow-subtle space-y-8 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-100 pb-6">
            <Badge variant="teal" className="mb-2">
              Transparency
            </Badge>
            <h1 className="text-3xl font-extrabold text-navy-950 font-serif">
              Cookie Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Version 1.0 • Technical session cookies and functional tokens
            </p>
          </div>

          <p>
            Wrap-Up utilizes essential and functional browser cookies strictly to maintain authenticated user sessions, prevent cross-site request forgery (CSRF), and remember your currency or language preferences. We do not use third-party invasive advertising cookies or cross-site tracking pixels.
          </p>
        </div>
      </div>
    </div>
  );
}
