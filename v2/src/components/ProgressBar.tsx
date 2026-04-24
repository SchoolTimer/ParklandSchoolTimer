type Props = { percent: number };

export function ProgressBar({ percent }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-700"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
