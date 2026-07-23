export default function CategoryLoading() {
  return (
    <div className="container-editorial py-10">
      <div className="h-6 w-40 animate-pulse rounded-sm bg-ivory-300" />
      <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/5] animate-pulse rounded-sm bg-ivory-300" />
            <div className="h-4 w-3/4 animate-pulse rounded-sm bg-ivory-300" />
            <div className="h-4 w-1/2 animate-pulse rounded-sm bg-ivory-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
