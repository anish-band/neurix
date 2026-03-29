"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Session() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [view, setView] = useState("form");
  const [timerOption, setTimerOption] = useState("");
  const [session, setSession] = useState({
    name: "",
    category: "",
    startTime: null as Date | null,
  });
  const [results, setResults] = useState({
    rating: 0,
    notes: "",
    endTime: null as Date | null,
  });

  const reset = () => {
    setSession({ name: "", category: "", startTime: null });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSession((prev) => ({ ...prev, [name]: value }));
  };

  const handleResultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const converted = name === "rating" ? Number(value) : value;
    setResults((prev) => ({ ...prev, [name]: converted }));
  };

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [isRunning]);

  function start() {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
  }

  function pause() {
    setIsRunning(false);
  }

  function end() {
    setIsRunning(false);
    setView("end");
  }

  function formatTime() {
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");
    const mm = String(milliseconds).padStart(2, "0");

    if (hours > 0) return `${h}:${m}:${s}`;
    return `${m}:${s}.${mm}`;
  }

  /* ── Not signed in ──────────────────────────────────── */
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#111118] border border-[#1e1e2e] flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-[#3d3d52]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-[#e2e2f0]">Sign in to track focus</h2>
            <p className="text-[#6b6b8a]">You need an account to log sessions.</p>
          </div>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] text-white rounded-xl font-medium hover:opacity-90 transition-opacity duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  /* ── Form view ──────────────────────────────────────── */
  if (view === "form") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 page-enter">
        {/* Back link */}
        <Link
          href="/"
          className="absolute top-6 left-6 text-sm text-[#3d3d52] hover:text-[#6b6b8a] transition-colors duration-200"
        >
          ← Neurix
        </Link>

        <div className="w-full max-w-lg space-y-14">
          {/* Prompt */}
          <div className="text-center space-y-1">
            <p className="text-xs text-[#3d3d52] uppercase tracking-[0.3em]">New Session</p>
          </div>

          {/* Fill-in fields */}
          <div className="space-y-10 text-center">
            {/* Task name */}
            <div className="space-y-3">
              <label className="text-[#6b6b8a] text-xl">I want a</label>
              <div className="relative">
                <button onClick={() => {
                  setTimerOption("stopwatch");
                
                }}>Stopwatch (classic)</button>
                <button onClick={() => {
                  setTimerOption("pomodoro");
                }}>Pomodoro Timer</button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[#6b6b8a] text-xl">I&apos;m going to focus on</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="what are you working on?"
                  name="name"
                  value={session.name}
                  onChange={handleChange}
                  autoFocus
                  className="w-full bg-transparent text-center text-3xl font-semibold text-[#e2e2f0] placeholder:text-[#222230] border-b-2 border-[#1e1e2e] focus:border-[#7c6af7] outline-none pb-3 transition-colors duration-200"
                />
                {session.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] rounded-full" />
                )}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label className="text-[#6b6b8a] text-xl">in the category of</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="category"
                  name="category"
                  value={session.category}
                  onChange={handleChange}
                  className="w-full bg-transparent text-center text-3xl font-semibold text-[#e2e2f0] placeholder:text-[#222230] border-b-2 border-[#1e1e2e] focus:border-[#7c6af7] outline-none pb-3 transition-colors duration-200"
                />
                {session.category && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] rounded-full" />
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              disabled={!session.name.trim() || !session.category.trim()}
              onClick={async () => {
                const now = new Date();
                setSession((prev) => ({ ...prev, startTime: now }));
                const res = await fetch("/api/sessions", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...session,
                    startTime: now,
                    userId: user?.id,
                  }),
                });
                const data = await res.json();
                setSessionId(data.id);
                setView("active");
                start();
              }}
              className="px-10 py-4 bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] text-white rounded-xl font-semibold text-lg hover:opacity-90 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 shadow-xl shadow-[#7c6af7]/20"
            >
              Begin Session
            </button>
            <button
              type="button"
              onClick={reset}
              className="text-xs text-[#3d3d52] hover:text-[#6b6b8a] transition-colors duration-200 uppercase tracking-widest"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Active timer view ──────────────────────────────── */
  if ((view === "active") && (timerOption === "stopwatch")) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 page-enter">
        {/* Session label */}
        <div className="text-center mb-14 space-y-1.5">
          <p className="text-xs text-[#3d3d52] uppercase tracking-[0.3em]">{session.category}</p>
          <h2 className="text-2xl font-semibold text-[#e2e2f0]">{session.name}</h2>
        </div>

        {/* Timer ring */}
        <div
          className={`relative flex items-center justify-center rounded-full w-60 h-60 border-2 mb-14 transition-all duration-500 ${
            isRunning
              ? "border-[#7c6af7] timer-ring-active"
              : "border-[#1e1e2e]"
          }`}
        >
          {/* Subtle inner glow when active */}
          {isRunning && (
            <div className="absolute inset-4 rounded-full bg-[#7c6af7]/5 blur-sm" />
          )}

          <div className="relative text-center">
            <div
              className={`font-mono text-5xl font-bold tracking-tight tabular-nums transition-colors duration-300 ${
                isRunning ? "text-[#e2e2f0]" : "text-[#3d3d52]"
              }`}
            >
              {formatTime()}
            </div>
            {!isRunning && elapsedTime > 0 && (
              <p className="text-[#3d3d52] text-[10px] mt-2 uppercase tracking-[0.25em]">
                Paused
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Pause / Resume toggle */}
          <button
            onClick={isRunning ? pause : start}
            className={`px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 ${
              isRunning
                ? "bg-[#111118] border border-[#1e1e2e] text-[#e2e2f0] hover:border-[#2a2a3a] hover:bg-[#16161f]"
                : "bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] text-white hover:opacity-90 shadow-lg shadow-[#7c6af7]/20"
            }`}
          >
            {isRunning ? "Pause" : "Resume"}
          </button>

          {/* End session */}
          <button
            onClick={end}
            className="px-8 py-3.5 bg-transparent border border-[#1e1e2e] text-[#6b6b8a] rounded-xl font-semibold hover:border-red-900/50 hover:text-red-400 transition-all duration-200"
          >
            End
          </button>
        </div>
      </div>
    );
  }

  /* ── End / rating view ──────────────────────────────── */
  if (view === "end") {
    const lengthInSeconds = Math.round(elapsedTime / 1000);
    const durationLabel =
      lengthInSeconds < 60
        ? `${lengthInSeconds}s`
        : `${Math.floor(lengthInSeconds / 60)}m ${lengthInSeconds % 60}s`;

    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 page-enter">
        <div className="w-full max-w-md space-y-10">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <h2 className="text-3xl font-bold text-[#e2e2f0]">How did that go?</h2>
            <p className="text-[#6b6b8a] text-sm">
              {session.name} &middot; {durationLabel}
            </p>
          </div>

          {/* Flow rating — visual 1–10 selector */}
          <div className="space-y-4">
            <p className="text-xs text-[#3d3d52] uppercase tracking-[0.3em] text-center">
              Flow State
            </p>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setResults((prev) => ({ ...prev, rating: n }))}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    results.rating === n
                      ? "bg-gradient-to-br from-[#7c6af7] to-[#4f9cf9] text-white shadow-lg shadow-[#7c6af7]/25 scale-110"
                      : results.rating > n
                      ? "bg-[#7c6af7]/15 text-[#7c6af7]"
                      : "bg-[#111118] border border-[#1e1e2e] text-[#3d3d52] hover:bg-[#16161f] hover:text-[#6b6b8a] hover:border-[#2a2a3a]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-center text-[#6b6b8a] text-sm h-5">
              {results.rating === 0
                ? ""
                : results.rating <= 3
                ? "Rough session"
                : results.rating <= 5
                ? "Decent effort"
                : results.rating <= 7
                ? "Good focus"
                : results.rating <= 9
                ? "Strong flow"
                : "Deep flow state ✦"}
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs text-[#3d3d52] uppercase tracking-[0.3em]">
              Notes — optional
            </label>
            <textarea
              name="notes"
              placeholder="Anything worth capturing..."
              value={results.notes}
              onChange={(e) =>
                handleResultsChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
              }
              rows={3}
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-xl px-4 py-3 text-[#e2e2f0] placeholder:text-[#222230] focus:border-[#7c6af7]/50 outline-none resize-none transition-colors duration-200 text-sm"
            />
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={async () => {
              const now = new Date();
              setResults((prev) => ({ ...prev, endTime: now }));
              await fetch("/api/sessions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: sessionId,
                  ...results,
                  endTime: now,
                  length: lengthInSeconds,
                  userId: user?.id,
                }),
              });
              setView("success");
              setTimeout(() => router.push("/"), 2200);
            }}
            className="w-full py-4 bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity duration-200 shadow-xl shadow-[#7c6af7]/20"
          >
            Save Session
          </button>
        </div>
      </div>
    );
  }

  /* ── Success view ───────────────────────────────────── */
  if (view === "success") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center page-enter">
        <div className="text-center space-y-6">
          {/* Animated check */}
          <div className="success-icon w-20 h-20 rounded-full bg-gradient-to-br from-[#7c6af7] to-[#4f9cf9] flex items-center justify-center mx-auto shadow-xl shadow-[#7c6af7]/30">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                className="check-path"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#e2e2f0]">Session saved.</h2>
            <p className="text-[#6b6b8a] mt-2 text-sm">Great work. Returning home&hellip;</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
