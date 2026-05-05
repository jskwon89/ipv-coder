import { NextRequest, NextResponse } from "next/server";
import {
  getBalance,
  chargeCredits,
  getTransactions,
} from "@/lib/credits";

const DEFAULT_USER = "default";

export async function GET() {
  try {
    const balance = await getBalance();
    const transactions = await getTransactions();

    return NextResponse.json({ balance, transactions });
  } catch {
    return NextResponse.json(
      { error: "크레딧 정보 로드 중 오류가 발생했습니다.", balance: 0, transactions: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, description } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "유효한 충전 금액을 입력해주세요." },
        { status: 400 }
      );
    }

    await chargeCredits(
      DEFAULT_USER,
      amount,
      description || `${amount.toLocaleString()} 크레딧 충전`
    );

    const balance = await getBalance();
    return NextResponse.json({ success: true, balance });
  } catch {
    return NextResponse.json(
      { error: "충전 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
