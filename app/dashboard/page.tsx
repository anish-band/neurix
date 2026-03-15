"use client";

import Link from "next/link"
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  const {user} = useUser();

  return (
  <div>
    <h1>Dashboard</h1>
    <Link href="/">Home</Link>
      <div>
        {
          !user ? (<SignInButton>
            <button>Log In</button>
          </SignInButton>) : (
            <UserButton />
          )
        }
      </div>
  
  </div>
  
  );
}