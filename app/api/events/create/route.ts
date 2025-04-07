import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import Activity from "@/models/Activity";
import connectDB from "@/lib/dbConnect";
import getCookieToken from "@/utils/getCookieToken";

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const body = await req.json();
        const csrfTokenFromCookie = getCookieToken(req, "csrf_token");

        const {
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
            return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
        }

        // Validasi dasar
        if (!name || !startDate || !endDate) {
            return NextResponse.json(
                { error: "Name, start date, and end date are required." },
                { status: 400 }
            );
        }

        const newEvent = new Event({
            name,
            description,
            vendorsId: selectedVendorIds,
            storesId: selectedStoresIds,
            created_by,
            start_date: new Date(startDate),
            end_date: new Date(endDate),
            location,
            created_at: new Date(),
        });

        await newEvent.save()

        if (newEvent._id) {
            const newActivity = new Activity({
                user_id: admin_id,
                user_role: "admin",
                action: `Admin ${created_by} make an event ${name}`,
                created_at: new Date(),
            })

            await newActivity.save()
        }

        return NextResponse.json(
            {
                message: "Event data received successfully.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
