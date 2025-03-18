"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Briefcase, Users, MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { userData } = useAuth();
    const router = useRouter();

    return (
        <div className="space-y-8">
            <div className="hero-gradient rounded-xl p-8">
                <h1 className="text-3xl font-bold">Welcome back, {userData?.name}</h1>
                <p className="text-muted-foreground mt-2">
                    Stay connected with your LOGA sisters and explore new opportunities
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
                {/* Add similar cards for Jobs, Forum Posts, and Alumni */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-hover-effect">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Recent Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EmptyState
                            icon={Calendar}
                            title="No events yet"
                            description="Create an event to bring the LOGA community together"
                            action={{
                                label: "Create Event",
                                onClick: () => router.push("/dashboard/events")
                            }}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Latest Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EmptyState
                            icon={Briefcase}
                            title="No job postings"
                            description="Post a job opportunity to help fellow alumni"
                            action={{
                                label: "Post Job",
                                onClick: () => {/* handle click */ }
                            }}
                        />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Personal Information</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="font-medium">Name</div>
                            <div>{userData?.name}</div>
                            <div className="font-medium">Email</div>
                            <div>{userData?.email}</div>
                            <div className="font-medium">Phone</div>
                            <div>{userData?.phoneNumber}</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Academic Information</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="font-medium">Year Group</div>
                            <div>{userData?.yearGroup}</div>
                            <div className="font-medium">Institution</div>
                            <div>{userData?.institution}</div>
                            <div className="font-medium">Occupation</div>
                            <div>{userData?.occupation}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 