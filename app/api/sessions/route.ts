import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get("userId");

    const results = await prisma.session.findMany({
      where: {userId: userId ?? ""}
    })

    return NextResponse.json(results);

  } catch (error) {
    console.log("Error reading from db: " + error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const result = await prisma.session.update({
      where: { id:body.id },
      data: {
        rating: body.rating,
        length: body.length,
        notes: body.notes,
        endTime: body.endTime,
        userId: body.userId
      }
    })

    return NextResponse.json(result);
  } catch (error) {
    console.log("Error writing to db: " + error);
    return NextResponse.json({error: "Failed to update session" }, { status: 500})
  }
}