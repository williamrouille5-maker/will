export default function StatBadge({ value, label, emoji }) {
  return (
    <div className="flex-shrink-0 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-white min-w-[110px]">
      <div className="text-lg font-bold leading-tight">{emoji} {value}</div>
      <div className="text-xs text-white/80 mt-0.5">{label}</div>
    </div>
  )
}
