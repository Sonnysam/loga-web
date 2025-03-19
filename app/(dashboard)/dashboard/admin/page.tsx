"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvents } from "@/hooks/useEvents";
import { useJobs } from "@/hooks/useJobs";
import { useForum } from "@/hooks/useForum";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { ManageEvents } from "@/components/admin/ManageEvents";
import { ManageJobs } from "@/components/admin/ManageJobs";
import { ManageUsers } from "@/components/admin/ManageUsers";
import { ManagePosts } from "@/components/admin/ManagePosts";
import type { User } from "@/lib/types";

export default function AdminDashboard() {
    const { userRole, isLoading } = useAuth();
    const { events } = useEvents();
    const { jobs } = useJobs();
    const { posts } = useForum();
    const [userCount, setUserCount] = useState(0);
    const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !userRole?.isAdmin) {
            router.push("/dashboard");
        }

        // Real-time user count and users data
        const unsubscribe = onSnapshot(query(collection(db, "users")), (snapshot) => {
            setUserCount(snapshot.size);
            const usersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as User[];
            setUsers(usersList);
        });

        return () => unsubscribe();
    }, [userRole, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!userRole?.isAdmin) {
        return null;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{userCount}</p>
                    </CardContent>
                </Card>

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

            <Card>
                <CardHeader>
                    <CardTitle>Dues Collection</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">
                        {users.filter(user => user.duesStatus === "paid").length} / {userCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Paid members</p>
                </CardContent>
            </Card>

            {/* Management sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ManageEvents events={events} />
                <ManageJobs jobs={jobs} />
                <ManagePosts posts={posts} />
                <ManageUsers userCount={userCount} />
            </div>
        </div>
    );
} 