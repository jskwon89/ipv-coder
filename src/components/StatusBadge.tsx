export type CaseStatus =
  | "pending"
  | "checking"
  | "available"
  | "unavailable"
  | "fetched"
  | "coding"
  | "coded"
  | "reviewed"
  | "error";

const statusConfig: Record<
  CaseStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: { label: "대기", bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", dot: "bg-gray-400" },
  checking: { label: "확인중", bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-400" },
  available: { label: "전문있음", bg: "bg-green-50 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", dot: "bg-green-400" },
  unavailable: { label: "미등록", bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", dot: "bg-red-400" },
  fetched: { label: "전문확보", bg: "bg-teal-50 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-300", dot: "bg-teal-400" },
  coding: { label: "코딩중", bg: "bg-yellow-50 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", dot: "bg-yellow-400" },
  coded: { label: "코딩완료", bg: "bg-green-50 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", dot: "bg-green-500" },
  reviewed: { label: "검토완료", bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-400" },
  error: { label: "오류", bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
};

export default function StatusBadge({
  status,
  showTooltip = false,
}: {
  status: CaseStatus;
  showTooltip?: boolean;
}) {
  const config = statusConfig[status];
  const tooltip =
    status === "unavailable"
      ? "casenote/lbox에 미등록. 등록 요청 필요"
      : undefined;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      title={showTooltip ? tooltip : undefined}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
      {status === "unavailable" && showTooltip && (
        <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )}
    </span>
  );
}
