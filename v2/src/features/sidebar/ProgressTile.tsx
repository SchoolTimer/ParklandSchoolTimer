import { ProgressBar } from "../../components/ProgressBar";

type Props = { percent: number; label: string };

export function ProgressTile({ percent, label }: Props) {
  return (
    <div className="card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-dim font-semibold">{label}</span>
        <span className="text-sm font-bold tabular text-text">{percent}%</span>
      </div>
      <ProgressBar percent={percent} />
    </div>
  );
}
