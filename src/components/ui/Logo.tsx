import Image from "next/image"

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Try to render custom logo from /public; fallback is hidden if missing */}
      <div className="flex items-center">
        <Image
          src="/adamsneakers-logo.svg"
          alt="Adam'sneakers logo"
          width={160}
          height={48}
          className="object-contain"
          priority
        />
      </div>
      <span className="text-2xl font-bold text-slate-900">
        Adam'sneakers
      </span>
    </div>
  )
}
