import { cn } from "@/lib/utils"

const SIZE = 11

/* Fixed, QR-like bit pattern: three finder squares plus a deterministic scatter. */
function isOn(x: number, y: number) {
  const inFinder = (fx: number, fy: number) => x >= fx && x < fx + 3 && y >= fy && y < fy + 3
  if (inFinder(0, 0) || inFinder(SIZE - 3, 0) || inFinder(0, SIZE - 3)) return true
  // keep a one-cell quiet zone around each finder
  if ((x <= 3 && y <= 3) || (x >= SIZE - 4 && y <= 3) || (x <= 3 && y >= SIZE - 4)) return false
  return (x * 7 + y * 13 + x * y) % 5 < 2
}

const cells = Array.from({ length: SIZE * SIZE }, (_, i) => isOn(i % SIZE, Math.floor(i / SIZE)))

/** Decorative QR-style mark for certificate chips. */
export function QrMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid size-full gap-px", className)}
      style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
    >
      {cells.map((on, i) => (
        <span key={i} className={cn("rounded-[1px]", on ? "bg-current" : "bg-transparent")} />
      ))}
    </span>
  )
}
