"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  const [introPhase, setIntroPhase] = useState<"in" | "hold" | "out" | "done">("in");

  useEffect(() => {
    // hold → start exit after 1 100ms
    const holdTimer = setTimeout(() => setIntroPhase("out"), 1100);
    // done → reveal content after exit animation (450ms)
    const doneTimer = setTimeout(() => setIntroPhase("done"), 1550);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  /* ── Intro screen ────────────────────────────────────── */
  if (introPhase !== "done") {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-[#0a0a0f] ${
          introPhase === "out" ? "intro-exit" : ""
        }`}
      >
        <div className="text-center">
          <h1
            className={`text-7xl font-bold tracking-tight bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] bg-clip-text text-transparent select-none ${
              introPhase === "in" || introPhase === "hold" ? "intro-logo" : ""
            }`}
          >
            Neurix
          </h1>
          <p className="intro-sub text-[#6b6b8a] text-sm uppercase tracking-[0.3em] mt-4">
            A cognitive engine
          </p>
        </div>
      </div>
    );
  }

  /* ── Logged-in greeting ──────────────────────────────── */
  if (isLoaded && isSignedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center page-enter">
        <div className="text-center space-y-8">
          {/* Wordmark */}
          <p className="text-sm text-[#3d3d52] uppercase tracking-[0.3em]">Neurix</p>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-[#e2e2f0]">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] bg-clip-text text-transparent">
                {user.firstName || user.username}
              </span>
              .
            </h1>
            <p className="text-[#6b6b8a]">Ready to focus?</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3.5 bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-[#7c6af7]/20"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push("/session")}
              className="px-8 py-3.5 bg-transparent border border-[#1e1e2e] text-[#6b6b8a] rounded-xl font-medium hover:border-[#7c6af7]/40 hover:text-[#e2e2f0] transition-all duration-200"
            >
              Start a Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Marketing (logged out) ──────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0a0a0f] page-enter">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#1e1e2e]">
        <span className="text-lg font-bold bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] bg-clip-text text-transparent">
          Neurix
        </span>
        <SignInButton>
          <button className="px-4 py-2 text-sm text-[#e2e2f0] border border-[#1e1e2e] rounded-lg hover:border-[#7c6af7]/50 hover:text-white transition-all duration-200">
            Sign in
          </button>
        </SignInButton>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7c6af7]/20 bg-[#7c6af7]/5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7c6af7]" />
            <span className="text-xs text-[#7c6af7] tracking-wide">Focus tracking, reimagined</span>
          </div>

          <h1 className="text-6xl font-bold text-[#e2e2f0] leading-[1.1] tracking-tight">
            Track your focus.{" "}
            <br />
            <span className="bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] bg-clip-text text-transparent">
              Understand your patterns.
            </span>
          </h1>

          <p className="text-[#6b6b8a] text-lg max-w-md mx-auto leading-relaxed">
            Neurix helps you log deep work sessions, measure flow state, and build
            clarity around how you spend your cognitive energy.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
            <SignInButton>
              <button className="px-8 py-4 bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] text-white rounded-xl font-semibold text-base hover:opacity-90 transition-opacity duration-200 shadow-xl shadow-[#7c6af7]/25">
                Get started — it&apos;s free
              </button>
            </SignInButton>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2.5 justify-center mt-16">
          {[
            "Deep work timer",
            "Flow state rating",
            "Category analytics",
            "Session insights",
            "Pattern recognition",
          ].map((f) => (
            <span
              key={f}
              className="px-3.5 py-1.5 text-xs text-[#6b6b8a] border border-[#1e1e2e] rounded-full"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
