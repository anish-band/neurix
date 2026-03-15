import Link from "next/link"

export default function Home() {
  return (
    <div>
      <main>
        <h1>Neurix</h1>
        <p>A cognitive engine</p>
        <Link href="/dashboard">Get Started</Link>
      </main>
    </div>
  );
}
