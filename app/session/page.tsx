"use client";

import {useState} from "react"
import { useUser } from "@clerk/nextjs";

export default function Session () {
  const { user } = useUser();
  const [session, setSession] = useState({
    name: "",
    category: "",
    startTime: null as Date | null
  });

  const reset = () => {
    setSession({
      name: "",
      category: "",
      startTime: null
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setSession(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form>
      <div className="task-name">
        <label>
        Task Name:
        <input type="text" placeholder="Enter Task Name" name="name" value={session.name} onChange={handleChange}/>
      </label>
      </div>

      <div className="category">
        <label>
          Category:
          <input type="text" placeholder="Enter Category" name="category" value={session.category} onChange={handleChange}/>
        </label>
      </div>

      <div className="start-button">
        <button type="button" onClick={
          () => {
            const now = new Date();
            setSession(prev => ({
              ...prev,
              startTime: now
            }))

            fetch("/api/sessions", {
              method:"POST",
              headers: { "Content-Type": "application/json" },
              body:JSON.stringify({
                ...session,
                startTime: now,
                userId: user?.id
              })
            })
          }
        }>Start</button>
      </div>
      <div className="reset">
        <button type="button" onClick={reset}>Reset</button>
      </div>
      
    </form>
  );
}