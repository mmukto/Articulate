function scoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-600";
  if (score >= 60) return "bg-amber-500";
  return "bg-danger";
}

export function ScoreBar({
  label,
  score,
  comment,
}: {
  label: string;
  score: number;
  comment?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink-soft">{label}</span>
        <span className="font-serif text-sm font-semibold tabular-nums">{score}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className={`h-full rounded-full transition-all duration-700 ${scoreColor(score)}`}
          style={{ width: `${Math.max(2, score)}%` }}
        />
      </div>
      {comment ? (
        <p className="mt-1 text-xs leading-relaxed text-ink-mute">{comment}</p>
      ) : null}
    </div>
  );
}
