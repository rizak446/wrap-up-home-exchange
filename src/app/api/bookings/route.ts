import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get("guestId");
    const hostId = searchParams.get("hostId");

    if (guestId) {
      const bookings = await repository.getBookingsByGuest(guestId);
      return NextResponse.json({ success: true, bookings });
    }

    if (hostId) {
      const bookings = await repository.getBookingsByHost(hostId);
      return NextResponse.json({ success: true, bookings });
    }

    const allBookings = await repository.getAllBookings();
    return NextResponse.json({ success: true, bookings: allBookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestId, propertyId, checkIn, checkOut, guestCount, hostNotes } = body;

    if (!guestId || !propertyId || !checkIn || !checkOut || !guestCount) {
      return NextResponse.json(
        { success: false, error: "guestId, propertyId, checkIn, checkOut, and guestCount are required" },
        { status: 400 }
      );
    }

    const result = await repository.createBookingRequest({
      guestId,
      propertyId,
      checkIn,
      checkOut,
      guestCount: Number(guestCount),
      hostNotes,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, booking: result.booking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
