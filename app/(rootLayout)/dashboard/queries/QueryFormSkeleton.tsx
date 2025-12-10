import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QueryFormSkeleton() {
      return (
            <div className="rounded-md mx-auto py-8">
                  <Card className="w-full">
                        <CardHeader>
                              <CardTitle><Skeleton className="h-8 w-1/3" /></CardTitle>
                              <Skeleton className="h-4 w-2/3 mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                              <div className="space-y-4">
                                    <div className="space-y-2">
                                          <Skeleton className="h-4 w-20" />
                                          <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                          <Skeleton className="h-4 w-24" />
                                          <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                          <Skeleton className="h-4 w-28" />
                                          <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                          <Skeleton className="h-4 w-24" />
                                          <Skeleton className="h-32 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                          <Skeleton className="h-4 w-16" />
                                          <Skeleton className="h-10 w-full" />
                                    </div>
                              </div>
                              <div className="flex justify-end space-x-4 pt-4">
                                    <Skeleton className="h-10 w-20" />
                                    <Skeleton className="h-10 w-28" />
                              </div>
                        </CardContent>
                  </Card>
            </div>
      );
}
