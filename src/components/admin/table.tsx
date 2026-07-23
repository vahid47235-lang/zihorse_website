import { cn } from "@/lib/utils";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-neutral-medium bg-ivory-50">
      <table className="w-full min-w-max text-sm">{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-neutral-medium bg-ivory-100 text-xs font-medium text-midnight-500">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3 text-right whitespace-nowrap", className)}>{children}</th>;
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-neutral-medium">{children}</tbody>;
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="transition-colors hover:bg-ivory-100">{children}</tr>;
}

export function Td({
  children,
  className,
  dir,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
  title?: string;
}) {
  return (
    <td dir={dir} title={title} className={cn("px-4 py-3 whitespace-nowrap text-midnight-800", className)}>
      {children}
    </td>
  );
}
