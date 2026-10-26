import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      // Admin query for all transactions
      const allTx = await repository.getAllCreditTransactions();
      return NextResponse.json({ success: true, transactions: allTx });
    }

    const account = await repository.getCreditAccount(userId);
    const transactions = await repository.getCreditTransactions(userId);

    return NextResponse.json({ success: true, account, transactions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, reason, adminId } = body;

    if (!userId || amount === undefined || !reason || !adminId) {
      return NextResponse.json(
        { success: false, error: "userId, amount, reason, and adminId are strictly required" },
        { status: 400 }
      );
    }

    const result = await repository.adminCreditAdjustment({
      userId,
      amount: Number(amount),
      reason,
      adminId,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, newBalance: result.newBalance });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
