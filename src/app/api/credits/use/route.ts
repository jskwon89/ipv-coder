import { NextRequest, NextResponse } from "next/server";
import { spendCredits, canAfford, getBalance } from "@/lib/credits";

const DEFAULT_USER = "default";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, service, description } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "유효한 금액을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!service) {
      return NextResponse.json(
        { error: "서비스명을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!(await canAfford(DEFAULT_USER, amount))) {
      const balance = await getBalance();
      return NextResponse.json(
        {
          error: "크레딧이 부족합니다.",
          balance,
          required: amount,
          shortage: amount - balance,
        },
        { status: 402 }
      );
    }

    const success = await spendCredits(
      DEFAULT_USER,
      amount,
      service,
      description || `${service} 사용`
    );

    if (!success) {
      return NextResponse.json(
        { error: "크레딧 차감에 실패했습니다." },
        { status: 500 }
      );
    }

    const balance = await getBalance();
    return NextResponse.json({ success: true, balance });
  } catch {
    return NextResponse.json(
      { error: "크레딧 사용 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
