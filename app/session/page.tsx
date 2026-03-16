"use client";

import {useState, useRef, useEffect } from "react"
import { useUser } from "@clerk/nextjs";
import Link from "next/link"

export default function Session () {
  const { user, isSignedIn} = useUser();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [view, setView] = useState("form")
  const [session, setSession] = useState({
    name: "",
    category: "",
    startTime: null as Date | null
  });
  const [results, setResults] = useState({
    rating: 0,
    notes: "",
    endTime: null as Date | null
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

  const handleResultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const converted = name === "rating" ? Number(value) : value;
    setResults(prev => ({
      ...prev,
      [name]: converted
    }))
  }

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
      if (intervalIdRef.current) clearInterval(intervalIdRef.current)
    }
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
    setView("end")
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

    return `${m}:${s}:${mm}`;
  }


  if (isSignedIn) {
    if (view === "form") {
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
              async () => {
                const now = new Date();
                setSession(prev => ({
                  ...prev,
                  startTime: now
                }))

                const res = await fetch("/api/sessions", {
                  method:"POST",
                  headers: { "Content-Type": "application/json" },
                  body:JSON.stringify({
                    ...session,
                    startTime: now,
                    userId: user?.id
                  })
                });
                const data = await res.json();
                setSessionId(data.id);

                setView("active");
                start();
              }
            }>Start</button>
          </div>
          <div className="reset">
            <button type="button" onClick={reset}>Reset</button>
          </div>
          
        </form>
    );
    } else if (view === "active") {
      return (
        <div className="timer">
          <div className="header">
            <h1>Name: "{session.name}" | Category: {session.category}</h1>
          </div>
          <div className="display">
            {formatTime()}
            <div className="buttons">
              <button onClick={start}>Start</button>
              <button onClick={pause}>Pause</button>
              <button onClick={end}>End</button>
            </div>
          </div>
        </div>
      )
    } else if (view === "end") {
      const lengthInSeconds = Math.round(elapsedTime / 1000);
      return (
        <form>
          <div className="flow-form">
            <div className="input">
              <label>
              Rank your flow (1-10)
              <input type="number" placeholder="Enter Flow Number" name="rating" value={results.rating} onChange={handleResultsChange}/>
            </label>
            <label>
              Additional Notes: 
              <input type="text" placeholder="Type Here" name="notes" value={results.notes} onChange={handleResultsChange}/>
            </label>
            </div>
            <div>
              <button type="button" onClick={ async () => {
                const now = new Date();
                setResults(prev => ({
                  ...prev,
                  endTime: now
                }))
                fetch("/api/sessions", {
                  method:"PATCH",
                  headers: { "Content-Type": "application/json" },
                  body:JSON.stringify({
                    id: sessionId,
                    ...results,
                    endTime: now,
                    length: lengthInSeconds,
                    userId: user?.id
                  })
                })

                alert("Feedback Submitted!");
              }} >Submit</button>
            </div>
            
          </div>
        </form>
      )
    }
    
  }

  return (
    <div>
      <p>You need to sign in first</p>
      <div>
        <Link href="/">Back to Home</Link>
      </div>
      <div>
        <Link href="/dashboard">Log In</Link>
      </div>
    </div>
    
  );

}