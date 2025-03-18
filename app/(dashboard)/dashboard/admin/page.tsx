"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvents } from "@/hooks/useEvents";
import { useJobs } from "@/hooks/useJobs";
import { useForum } from "@/hooks/useForum";

export default function AdminDashboard() {
    const { userRole, isLoading } = useAuth();
    const { events } = useEvents();
    const { jobs } = useJobs();
    const { posts } = useForum();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !userRole?.isAdmin) {
            router.push("/dashboard");
        }
    }, [userRole, isLoading, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!userRole?.isAdmin) {
        return null;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{events.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{jobs.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Forum Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{posts.length}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 