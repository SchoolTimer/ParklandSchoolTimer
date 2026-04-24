type Props = { title: string; description: string }

export function SectionHeader({ title, description }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-text leading-none">{title}</h2>
      <p className="text-sm text-dim mt-1">{description}</p>
    </div>
  )
}
