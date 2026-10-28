import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const users = await repository.getAllUsers();
    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role, adminId } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: "userId and role are required" },
        { status: 400 }
      );
    }

    await repository.updateUserRole(userId, role, adminId || "admin");
    return NextResponse.json({ success: true, message: `User role updated to ${role}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
