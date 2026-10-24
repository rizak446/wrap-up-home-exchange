import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === "respond") {
      const { hostId, decision } = body;
      if (!hostId || !["accept", "decline"].includes(decision)) {
        return NextResponse.json(
          { success: false, error: "hostId and valid decision ('accept' | 'decline') required" },
          { status: 400 }
        );
      }
      const res = await repository.respondToBooking({
        bookingId: id,
        hostId,
        action: decision,
      });
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, status: res.status });
    }

    if (action === "settle") {
      const res = await repository.settleBooking(id);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, hostEarned: res.hostEarned });
    }

    if (action === "cancel") {
      const { userId, reason } = body;
      if (!userId || !reason) {
        return NextResponse.json(
          { success: false, error: "userId and reason are required to cancel a booking" },
          { status: 400 }
        );
      }
      const res = await repository.cancelBooking({
        bookingId: id,
        userId,
        reason,
      });
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, refundedCredits: res.refundedCredits });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
