import { cn } from "@/lib/utils";

/**
 * Editorial-toned placeholder used wherever real product/lifestyle photography
 * will eventually be sourced. Keeps layouts production-accurate without
 * shipping generic stock imagery or broken <img> tags.
 */
export function MediaPlaceholder({
  label,
  className,
  ratio = "aspect-[4/5]",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn(
        ratio,
        "relative flex items-end overflow-hidden bg-gradient-to-br from-midnight-800 via-midnight-700 to-bronze-800 text-ivory-200",
        className
      )}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
      <span className="relative z-10 p-4 text-xs font-medium text-ivory-200/80">
        {label}
      </span>
    </div>
  );
}
