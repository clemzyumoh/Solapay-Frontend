// components/StatusBadge.tsx
export default function StatusBadge({ status }: { status: string }) {
  const color =
    {
      Paid: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Expired: "bg-red-100 text-red-700",
    }[status] || "bg-gray-100 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded text-sm font-medium ${color}`}>
      {status}
    </span>
  );
}
