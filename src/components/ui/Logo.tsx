import Image from "next/image"

export default function Logo() {
  return (
    <div className="flex items-center gap-1">
      {/* Try to render custom logo from /public; fallback is hidden if missing */}
      <div className="flex items-center">
        <Image
          src="/Logo%20d%27Adam%27sneakers%20avec%20masque%20et%20sneaker.png"
          alt="Adam'sneakers logo"
          width={110}
          height={32}
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
