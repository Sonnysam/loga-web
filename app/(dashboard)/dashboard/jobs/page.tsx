"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/useJobs";
import type { Job } from "@/lib/types";
import { toast } from "sonner";

const JOB_TYPES = [
    { id: "full-time", label: "Full Time" },
    { id: "part-time", label: "Part Time" },
    { id: "contract", label: "Contract" },
    { id: "internship", label: "Internship" },
    { id: "remote", label: "Remote" },
];

function JobSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
        </Card>
    );
}

export default function JobsPage() {
    const { user, userRole } = useAuth();
    const { jobs, loading, deleteJob: removeJob, updateJob } = useJobs();
    const [isOpen, setIsOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [newJob, setNewJob] = useState({
        title: "",
        company: "",
        location: "",
        type: "full-time",
        description: "",
        requirements: "",
        contactEmail: "",
        salary: "",
        applicationLink: "",
        deadline: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!newJob.title.trim() || !newJob.company.trim() || !newJob.description.trim()) {
                toast.error("Please fill in all required fields");
                return;
            }

            await addDoc(collection(db, "jobs"), {
                ...newJob,
                postedBy: user?.uid,
                postedAt: serverTimestamp(),
                requirements: newJob.requirements.split('\n').filter(r => r.trim()),
            });

            setIsOpen(false);
            setNewJob({
                title: "",
                company: "",
                location: "",
                type: "full-time",
                description: "",
                requirements: "",
                contactEmail: "",
                salary: "",
                applicationLink: "",
                deadline: "",
            });
            toast.success("Job posted successfully!");
        } catch (error) {
            toast.error("Failed to post job");
            console.error("Error adding job:", error);
        }
    };

    const handleEdit = (job: Job) => {
        setEditingJob(job);
        setNewJob({
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            description: job.description,
            requirements: job.requirements.join('\n'),
            contactEmail: job.contactEmail,
            salary: job.salary,
            applicationLink: job.applicationLink,
            deadline: job.deadline,
        });
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await removeJob(id);
            toast.success("Job deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete job.");
            console.error("Error deleting job:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Job Board</h1>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>Post Job</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingJob ? "Edit Job" : "Post New Job"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                placeholder="Job Title"
                                value={newJob.title}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, title: e.target.value })
                                }
                                required
                            />
                            <Input
                                placeholder="Company"
                                value={newJob.company}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, company: e.target.value })
                                }
                                required
                            />
                            <Textarea
                                placeholder="Job Description"
                                value={newJob.description}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, description: e.target.value })
                                }
                                required
                            />
                            <Textarea
                                placeholder="Requirements (one per line)"
                                value={newJob.requirements}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, requirements: e.target.value })
                                }
                                required
                            />
                            <Input
                                placeholder="Location"
                                value={newJob.location}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, location: e.target.value })
                                }
                                required
                            />
                            <Select
                                value={newJob.type}
                                onValueChange={(value) =>
                                    setNewJob({ ...newJob, type: value as Job["type"] })
                                }
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {JOB_TYPES.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="submit">
                                {editingJob ? "Update Job" : "Post Job"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="grid gap-4">
                    <JobSkeleton />
                    <JobSkeleton />
                    <JobSkeleton />
                </div>
            ) : jobs.length === 0 ? (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">No jobs posted yet</h3>
                            <p className="text-muted-foreground mt-1">
                                Be the first to post a job opportunity
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <Card key={job.id}>
                            <CardHeader>
                                <CardTitle>{job.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium text-primary">{job.company}</p>
                                <p className="text-muted-foreground mb-2">{job.description}</p>
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <strong>Location:</strong> {job.location}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Type:</strong> {job.type}
                                    </p>
                                    <div className="text-sm">
                                        <strong>Requirements:</strong>
                                        <ul className="list-disc list-inside mt-1">
                                            {job.requirements.map((req, i) => (
                                                <li key={i}>{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                            {(userRole?.isAdmin || user?.uid === job.postedBy) && (
                                <CardFooter className="gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(job)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(job.id)}
                                    >
                                        Delete
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 