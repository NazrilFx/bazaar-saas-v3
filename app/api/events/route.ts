import { NextResponse } from "next/server";
import Event from "@/models/Event";
import connectDB from "@/lib/dbConnect";

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find({}).sort({ created_at: -1 }).lean();
    const today = new Date();

    const eventsWithStatus = events.map((event) => {
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);

      let status: "upcoming" | "active" | "past" = "past";

      if (start > today) {
        status = "upcoming";
      } else if (start <= today && end >= today) {
        status = "active";
      }

      return {
        ...event,
        status,
      };
    });

    return new Response(JSON.stringify({ events: eventsWithStatus }, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
