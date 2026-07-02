// The one place the score→color thresholds live (80 = good, 60 = fair), so
// the written panel, spoken panel, and dashboard can never disagree.
function scoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-600";
  if (score >= 60) return "bg-amber-500";
  return "bg-danger";
}

/** Text-color variant of the same thresholds, for big score numerals. */
export function scoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-amber-600";
  return "text-danger";
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
