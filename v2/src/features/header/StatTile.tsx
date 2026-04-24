type Props = { percent: number; label: string };

export function StatTile({ percent, label }: Props) {
  return (
    <div className="card rounded-2xl p-4 flex flex-col gap-1">
      <div className="text-xs text-dim font-semibold">{label}</div>
      <div className="text-4xl font-bold text-text tabular leading-none">
        {percent}<span className="text-xl text-dim-2">%</span>
      </div>
    </div>
  );
}
