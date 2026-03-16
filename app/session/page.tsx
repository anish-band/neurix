"use client";

import {useState} from "react"

export default function Session () {
  const [session, setSession] = useState({
    taskName: "",
    category: "",
    startTime: null as Date | null
  });

  const reset = () => {
    setSession({
      taskName: "",
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
        <input type="text" placeholder="Enter Task Name" name="taskName" value={session.taskName} onChange={handleChange}/>
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
            setSession(prev => ({
              ...prev,
              startTime: new Date()
            }))
            console.log(session.startTime);
          }
        }>Start</button>
      </div>
      <div className="reset">
        <button type="button" onClick={reset}>Reset</button>
      </div>
      
    </form>
  );
}