import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "warning" | "error" | "success";
  className?: string;
}) {
  const toneClasses: Record<string, string> = {
    neutral: "bg-midnight-900 text-ivory-100",
    accent: "bg-bronze-500 text-ivory-50",
    warning: "bg-warning text-ivory-50",
    error: "bg-error text-ivory-50",
    success: "bg-success text-ivory-50",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium tracking-wide",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
