"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CreditBalance() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/credits");
        const data = await res.json();
        setBalance(data.balance ?? 0);
      } catch {
        setBalance(0);
      }
    };
    fetchBalance();

    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/credits"
      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-[#1a2744] transition-colors group"
    >
      <div className="flex items-center gap-2 min-w-0">
        <svg
          className="w-4 h-4 text-yellow-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-xs text-white/70 truncate">
          {balance === null ? "..." : balance.toLocaleString()} 크레딧
        </span>
      </div>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 group-hover:bg-white/20 transition-colors shrink-0">
        충전
      </span>
    </Link>
  );
}
