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

      <h2 className="text-5xl font-bold tracking-tight">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
          {description}
        </p>
      )}

      <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-blue-500" />
    </div>
  )
}