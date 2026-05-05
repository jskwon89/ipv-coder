import { supabaseAdmin } from "./supabase-admin";

export interface Transaction {
  id: string;
  type: "charge" | "use" | "refund";
  amount: number;
  description: string;
  service: string;
  createdAt: string;
  balanceAfter: number;
}

const CREDIT_ROW_ID = 1;
const INITIAL_BALANCE = 100;

type TransactionType = Transaction["type"];

interface CreditTransactionRow {
  id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  created_at: string | null;
}

function signedAmount(tx: Pick<Transaction, "type" | "amount">): number {
  return tx.type === "use" ? -tx.amount : tx.amount;
}

async function ensureCreditRow(): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("credits")
    .select("balance")
    .eq("id", CREDIT_ROW_ID)
    .maybeSingle();

  if (error) throw error;
  if (typeof data?.balance === "number") return data.balance;

  const { error: insertError } = await supabaseAdmin
    .from("credits")
    .insert({ id: CREDIT_ROW_ID, balance: INITIAL_BALANCE });

  if (insertError) throw insertError;
  return INITIAL_BALANCE;
}

async function setBalance(balance: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from("credits")
    .upsert({ id: CREDIT_ROW_ID, balance });

  if (error) throw error;
}

async function addTransaction(
  type: TransactionType,
  amount: number,
  description: string
): Promise<void> {
  const { error } = await supabaseAdmin.from("credit_transactions").insert({
    id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    amount,
    description,
  });

  if (error) throw error;
}

export async function getBalance(): Promise<number> {
  return ensureCreditRow();
}

export async function canAfford(_userId: string, amount: number): Promise<boolean> {
  return (await getBalance()) >= amount;
}

export async function chargeCredits(
  _userId: string,
  amount: number,
  description: string
): Promise<void> {
  const current = await getBalance();
  await setBalance(current + amount);
  await addTransaction("charge", amount, description);
}

export async function spendCredits(
  _userId: string,
  amount: number,
  service: string,
  description: string
): Promise<boolean> {
  const current = await getBalance();
  if (current < amount) return false;

  await setBalance(current - amount);
  await addTransaction("use", amount, description || `${service} 사용`);
  return true;
}

export async function refundCredits(
  _userId: string,
  amount: number,
  service: string,
  description: string
): Promise<void> {
  const current = await getBalance();
  await setBalance(current + amount);
  await addTransaction("refund", amount, description || `${service} 환불`);
}

export async function getTransactions(): Promise<Transaction[]> {
  const [balance, { data, error }] = await Promise.all([
    getBalance(),
    supabaseAdmin
      .from("credit_transactions")
      .select("id,type,amount,description,created_at")
      .order("created_at", { ascending: false }),
  ]);

  if (error) throw error;

  let runningBalance = balance;
  return ((data ?? []) as CreditTransactionRow[]).map((tx) => {
    const mapped: Transaction = {
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      description: tx.description ?? "",
      service: "",
      createdAt: tx.created_at ?? new Date().toISOString(),
      balanceAfter: runningBalance,
    };
    runningBalance -= signedAmount(mapped);
    return mapped;
  });
}
