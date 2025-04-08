import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import Activity from "@/models/Activity";
import connectDB from "@/lib/dbConnect";
import getCookieToken from "@/utils/getCookieToken";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const csrfTokenFromCookie = getCookieToken(req, "csrf_token");

    const {
      id,
      name,
      description,
      admin_id,
      selectedVendorIds,
      selectedStoresIds,
      created_by,
      startDate,
      endDate,
      location,
      csrfToken,
    } = body;

    if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid or missing event ID" }, { status: 400 });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        name,
        description,
        vendorsId: selectedVendorIds,
        storesId: selectedStoresIds,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        location,
        updated_at: new Date(),
      },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await Activity.create({
      user_id: admin_id,
      user_role: "admin",
      action: `Admin ${created_by} updated the event "${name}"`,
      created_at: new Date(),
    });

    return NextResponse.json({
      message: "Event updated successfully",
      event: updatedEvent,
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
