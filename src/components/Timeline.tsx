// components/Timeline.tsx
export default function Timeline({
  activities,
}: {
  activities: { type: string; timestamp: string }[];
}) {
  return (
    <ol className="relative border-l border-gray-300 space-y-6 mt-6">
      {activities.map((item, idx) => (
        <li key={idx} className="ml-4">
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-1"></div>
          <p className="font-semibold">{item.type}</p>
          <time className="text-xs text-gray-500">
            {new Date(item.timestamp).toLocaleString()}
          </time>
        </li>
      ))}
    </ol>
  );
}
