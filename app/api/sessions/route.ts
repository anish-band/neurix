import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await prisma.session.create({
      data: {
        userId: body.userId,
        name: body.name,
        category: body.category,
        startTime: body.startTime
      }
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.log("Error writing to db: " + error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}