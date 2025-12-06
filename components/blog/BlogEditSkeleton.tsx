import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BlogEditSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div>
          <Skeleton className="h-8 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <Card className="bg-card rounded-sm p-6 border-border">
        <CardHeader className="hidden">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-48 w-full" />
            </div>

            {/* Slug */}
            <div className="space-y-2 mt-16">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Image */}
            <div className="max-w-xs space-y-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Read Time */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Draft Switch */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-12" />
            </div>

            {/* Meta Information */}
            <div className="space-y-4 bg-gray-200 p-6 rounded-sm">
              <Skeleton className="h-6 w-32" />

              {/* Meta Title */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-20 w-full" />
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}