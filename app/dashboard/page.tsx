"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

/* ── Helpers ────────────────────────────────────────────── */

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/* ── Sidebar ────────────────────────────────────────────── */

function Sidebar({ username }: { username: string }) {
  return (
    <aside className="w-52 border-r border-[#1e1e2e] flex flex-col py-6 px-4 fixed h-full bg-[#0a0a0f]">
      {/* Logo */}
      <Link
        href="/"
        className="text-xl font-bold bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] bg-clip-text text-transparent mb-8 block"
      >
        Neurix
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {[
          { label: "Dashboard", href: "/dashboard", active: true },
          { label: "New Session", href: "/session", active: false },
          { label: "Settings",   href: "#",         active: false },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
              item.active
                ? "bg-[#7c6af7]/10 text-[#7c6af7]"
                : "text-[#6b6b8a] hover:text-[#e2e2f0] hover:bg-[#111118]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="pt-4 border-t border-[#1e1e2e]">
        <div className="flex items-center gap-3 px-3 py-2">
          <UserButton />
          <span className="text-sm text-[#6b6b8a] truncate">{username}</span>
        </div>
      </div>
    </aside>
  );
}

/* ── Dashboard ──────────────────────────────────────────── */

export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  const [userData, setUserData] = useState<any[]>([]);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/sessions?userId=${user.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setUserData(data));
  }, [user]);

  // First-visit greeting — shown once per account, stored in localStorage
  useEffect(() => {
    if (!user) return;
    const key = `neurix_welcomed_${user.id}`;
    if (!localStorage.getItem(key)) {
      setShowGreeting(true);
      localStorage.setItem(key, "1");
    }
  }, [user]);

  /* ── Not signed in ──────────────────────────────────── */
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-[#e2e2f0]">Dashboard</h1>
          <p className="text-[#6b6b8a]">Sign in to view your sessions and analytics.</p>
          <SignInButton>
            <button className="px-8 py-3.5 bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity duration-200">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  /* ── Existing computation logic — unchanged ─────────── */
  let totalTime = 0;
  let totalRating = 0;
  let avgRating = 0;

  for (let i = 0; i < userData.length; i++) {
    totalTime += userData[i].length || 0;
    totalRating += userData[i].rating || 0;
  }

  if (userData.length === 0) {
    avgRating = 0;
  } else {
    avgRating = totalRating / userData.length;
  }

  const dailyData: { [key: string]: number } = {};
  for (let i = 0; i < userData.length; i++) {
    const date = userData[i].startTime?.slice(0, 10) || "Unknown";
    dailyData[date] = (dailyData[date] || 0) + (userData[i].length || 0);
  }

  const categoryData: { [key: string]: number } = {};
  for (let i = 0; i < userData.length; i++) {
    const category = userData[i].category || "unknown";
    categoryData[category] = (categoryData[category] || 0) + (userData[i].length || 0);
  }

  const chartDailyData = Object.entries(dailyData).map(([date, seconds]) => ({
    date,
    minutes: Math.round(seconds / 60),
  }));

  const chartCategoryData = Object.entries(categoryData).map(([category, seconds]) => ({
    category,
    minutes: Math.round(seconds / 60),
  }));

  const categoryRankings: { [key: string]: { total: number; count: number } } = {};
  for (let i = 0; i < userData.length; i++) {
    const category = userData[i].category || "unknown";
    const rating = userData[i].rating || 0;
    if (!categoryRankings[category]) {
      categoryRankings[category] = { total: 0, count: 0 };
    }
    categoryRankings[category].total += rating;
    categoryRankings[category].count += 1;
  }

  let bestAvg = 0;
  let bestCategory = "";
  for (let category in categoryRankings) {
    let avg = categoryRankings[category].total / categoryRankings[category].count;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestCategory = category;
    }
  }

  const displayName = user.firstName || user.username || "there";

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <Sidebar username={user.username || user.firstName || ""} />

      <main className="flex-1 ml-52 p-8 max-w-5xl page-enter">

        {/* First-visit welcome banner */}
        {showGreeting && (
          <div className="mb-8 p-4 rounded-xl border border-[#7c6af7]/20 bg-[#7c6af7]/5 flex items-center justify-between">
            <div>
              <p className="text-[#e2e2f0] font-medium">
                Welcome to Neurix, {displayName}.
              </p>
              <p className="text-[#6b6b8a] text-sm mt-0.5">
                Start a session to begin tracking your focus patterns.
              </p>
            </div>
            <button
              onClick={() => setShowGreeting(false)}
              className="text-[#3d3d52] hover:text-[#6b6b8a] transition-colors ml-4 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#e2e2f0]">Dashboard</h1>
          <p className="text-[#6b6b8a] text-sm mt-1">Hey, {displayName}</p>
        </div>

        {/* ── Empty state ──────────────────────────────── */}
        {userData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#111118] border border-[#1e1e2e] flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 text-[#3d3d52]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#e2e2f0]">No sessions yet</h3>
            <p className="text-[#6b6b8a] max-w-xs text-sm leading-relaxed">
              Log your first focus session to start understanding your patterns and flow state.
            </p>
            <Link
              href="/session"
              className="mt-4 px-6 py-3 bg-gradient-to-r from-[#7c6af7] to-[#4f9cf9] text-white rounded-xl font-medium hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-[#7c6af7]/20"
            >
              Start your first session
            </Link>
          </div>
        ) : (
          <>
            {/* ── Stats cards ──────────────────────────── */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 hover:border-[#2a2a3a] transition-colors duration-200">
                <p className="text-[#3d3d52] text-xs uppercase tracking-[0.2em] mb-2">Sessions</p>
                <p className="text-3xl font-bold text-[#e2e2f0]">{userData.length}</p>
              </div>
              <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 hover:border-[#2a2a3a] transition-colors duration-200">
                <p className="text-[#3d3d52] text-xs uppercase tracking-[0.2em] mb-2">Total Time</p>
                <p className="text-3xl font-bold text-[#e2e2f0]">{formatDuration(totalTime)}</p>
              </div>
              <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 hover:border-[#2a2a3a] transition-colors duration-200">
                <p className="text-[#3d3d52] text-xs uppercase tracking-[0.2em] mb-2">Avg Flow</p>
                <p className="text-3xl font-bold text-[#e2e2f0]">
                  {avgRating.toFixed(1)}
                  <span className="text-[#3d3d52] text-lg font-normal">/10</span>
                </p>
              </div>
            </div>

            {/* Best category banner */}
            {bestCategory && (
              <div className="mb-8 p-4 rounded-xl border border-[#1e1e2e] bg-[#111118] flex items-center gap-4 hover:border-[#2a2a3a] transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c6af7] to-[#4f9cf9] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#3d3d52] text-xs uppercase tracking-[0.2em]">Best category</p>
                  <p className="text-[#e2e2f0] font-semibold">
                    {bestCategory}{" "}
                    <span className="text-[#6b6b8a] font-normal text-sm">
                      · {bestAvg.toFixed(1)} avg flow
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* ── Charts ───────────────────────────────── */}
            <div className="grid grid-cols-2 gap-5 mb-8">
              <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                <p className="text-[#3d3d52] text-xs uppercase tracking-[0.2em] mb-5">
                  Daily Time (min)
                </p>
                <BarChart width={290} height={160} data={chartDailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#3d3d52", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#3d3d52", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#16161f",
                      border: "1px solid #1e1e2e",
                      borderRadius: "10px",
                      color: "#e2e2f0",
                      fontSize: 12,
                    }}
                    cursor={{ fill: "#7c6af7", opacity: 0.06 }}
                  />
                  <Bar dataKey="minutes" fill="#7c6af7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </div>

              <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                <p className="text-[#3d3d52] text-xs uppercase tracking-[0.2em] mb-5">
                  By Category (min)
                </p>
                <BarChart width={290} height={160} data={chartCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: "#3d3d52", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#3d3d52", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#16161f",
                      border: "1px solid #1e1e2e",
                      borderRadius: "10px",
                      color: "#e2e2f0",
                      fontSize: 12,
                    }}
                    cursor={{ fill: "#4f9cf9", opacity: 0.06 }}
                  />
                  <Bar dataKey="minutes" fill="#4f9cf9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </div>
            </div>

            {/* ── Session list ─────────────────────────── */}
            <div>
              <p className="text-[#3d3d52] text-xs uppercase tracking-[0.2em] mb-4">
                Recent Sessions
              </p>
              <div className="space-y-2">
                {userData.map((session, index) => (
                  <div
                    key={index}
                    className="bg-[#111118] border border-[#1e1e2e] rounded-xl px-5 py-4 flex items-center justify-between hover:border-[#2a2a3a] transition-colors duration-150"
                  >
                    <div>
                      <p className="text-[#e2e2f0] font-medium text-sm">{session.name}</p>
                      <p className="text-[#6b6b8a] text-xs mt-0.5">{session.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#e2e2f0] text-sm font-medium">
                        {formatDuration(session.length || 0)}
                      </p>
                      {session.rating ? (
                        <p className="text-[#3d3d52] text-xs mt-0.5">
                          Flow {session.rating}/10
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
