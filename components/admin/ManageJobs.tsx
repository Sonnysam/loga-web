"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Job } from "@/lib/types";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";

interface ManageJobsProps {
    jobs: Job[];
}

export function ManageJobs({ jobs }: ManageJobsProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (jobId: string) => {
        try {
            setIsDeleting(true);
            await deleteDoc(doc(db, "jobs", jobId));
            toast.success("Job deleted successfully");
        } catch (error) {
            toast.error("Failed to delete job");
            console.error("Error deleting job:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Jobs</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="flex items-center justify-between p-4 rounded-lg border"
                        >
                            <div>
                                <h3 className="font-medium">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {job.company} • {job.type}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Posted {formatDistanceToNow(job.postedAt.toDate(), { addSuffix: true })}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(job.id)}
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 