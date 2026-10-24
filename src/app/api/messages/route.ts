import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      const messages = await repository.getMessages(conversationId);
      return NextResponse.json({ success: true, messages });
    }

    if (userId) {
      const conversations = await repository.getConversations(userId);
      return NextResponse.json({ success: true, conversations });
    }

    return NextResponse.json({ success: false, error: "userId or conversationId required" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, senderId, content } = body;

    if (!conversationId || !senderId || !content) {
      return NextResponse.json(
        { success: false, error: "conversationId, senderId, and content are required" },
        { status: 400 }
      );
    }

    const message = await repository.sendMessage(conversationId, senderId, content);
    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
