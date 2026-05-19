export default function FloatingButton() {
  return (
    <button className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#3B82F6] shadow-[0_0_40px_rgba(59,130,246,0.4)] transition hover:scale-110">

      <span className="material-symbols-outlined text-3xl text-white">
        add
      </span>

    </button>
  )
}