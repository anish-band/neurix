import Link from "next/link"

export default function Home() {
  return (
    <div>
      <main>
        <h1>Neurix</h1>
        <p>A cognitive engine</p>
        <div className="session">
          <Link href="/session">Log Session</Link>
        </div>
        <div className="dashboard">
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </main>
    </div>
  );
}
