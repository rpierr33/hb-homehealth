export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-100 border-t-[#E8476C]" />
        <p className="text-sm text-neutral-mid">Loading...</p>
      </div>
    </div>
  );
}
