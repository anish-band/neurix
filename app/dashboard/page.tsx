"use client";

import Link from "next/link"
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import {useState, useEffect} from "react"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis} from "recharts";

export default function Dashboard() {
  const {user, isSignedIn} = useUser();
  const [userData, setUserData] = useState<any[]>([]);
  

  useEffect(() => {
    if (!user) return;

    fetch(`/api/sessions?userId=${user.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(response => response.json()).then(data => setUserData(data));
  }, [user])

  if (!isSignedIn) {
    return (
      <div>
        <h1>Dashboard</h1>
        <Link href="/">Home</Link>
          <div>
            {
              <SignInButton>
                <button>Log In</button>
              </SignInButton>
            }
          </div>
      </div>
    )
  } else {
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

    const dailyData: { [key: string]: number} = {}
    for (let i = 0; i < userData.length; i++) {
      const date = userData[i].startTime?.slice(0, 10) || "Unkown"
      dailyData[date] = (dailyData[date] || 0) + (userData[i].length || 0);
    }

    const categoryData: { [key:string]: number} = {};
    for (let i = 0; i < userData.length; i++) {
      const category = userData[i].category || "unkown";
      categoryData[category] = (categoryData[category] || 0) + (userData[i].length || 0)
    }

    const chartDailyData = Object.entries(dailyData).map(([date, seconds]) => ({
      date,
      minutes: Math.round(seconds / 60)
    }));

    const chartCategoryData = Object.entries(categoryData).map(([category,seconds]) => ({
      category,
      minutes: Math.round(seconds/60)
    }));

    const categoryRankings: { [key: string]: {total: number; count: number}} = {};

    for (let i = 0; i < userData.length; i++) {
      const category = userData[i].category || "unkown";
      const rating = userData[i].rating || 0;

      if (!categoryRankings[category]) {
        categoryRankings[category] = {total: 0, count: 0};
      }

      categoryRankings[category].total += rating;
      categoryRankings[category].count += 1;
    }

    let bestAvg = 0
    let bestCategory = "";

    for (let category in categoryRankings) {
      let avg = categoryRankings[category].total / categoryRankings[category].count;

      if (avg > bestAvg) {
        bestAvg = avg;
        bestCategory = category;
      }
    }

    return(
      <div>
        <h1>Hello {user.username}</h1>
        <Link href="/">Home</Link>
        <UserButton />
        <h1>Total Sessions: {userData.length}</h1>
        <h1>Total Time: {totalTime}</h1>
        <h1>Average Rating: {avgRating.toFixed(1)}</h1>
        <h2>Your best category is {bestCategory} ({bestAvg} mins avg)</h2>
        <BarChart width={200} height={200} data={chartDailyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Bar dataKey="minutes" fill="#534AB7" />
        </BarChart>
        <BarChart width={200} height={200} data={chartCategoryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Bar dataKey="minutes" fill="#534AB7" />
        </BarChart> 
        <hr></hr>
        <div className="user-data">
          {userData.map((session, index) => (
          <div key={index}>
            <p>{session.id}: {session.name} | {session.category} | {session.length}s | Rating: {session.rating}</p>
          </div>
          ))}
        </div>
      </div>
      
      
    )
  }
}