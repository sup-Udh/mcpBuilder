interface SectionHeadingProps {
  title: string
  description?: string
}

export default function SectionHeading({
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-20 text-center">
      <h2 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-base" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}

      <div className="mx-auto mt-5 h-1 w-16 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
    </div>
  )
}