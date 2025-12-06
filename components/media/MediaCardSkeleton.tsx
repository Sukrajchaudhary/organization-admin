import { Skeleton } from "@/components/ui/skeleton";

export function MediaCardSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <Skeleton
            key={index}
            className="rounded-sm border border-[#D9D9D9]"
            style={{ width: "120px", height: "120px" }}
          />
        ))}
      </div>
    </div>
  );
}