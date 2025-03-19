"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ForumSkeleton() {
    return (
        <Card>
            <CardHeader className="space-y-2">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-[250px]" />
                        <Skeleton className="h-4 w-[120px]" />
                    </div>
                    <Skeleton className="h-6 w-[80px] rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />

                <div className="space-y-4">
                    <Skeleton className="h-4 w-[100px]" />
                    <div className="space-y-3">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-[100px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 