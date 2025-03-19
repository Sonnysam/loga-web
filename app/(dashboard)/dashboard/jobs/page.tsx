"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobCard } from "@/components/jobs/JobCard";
import { useJobs } from "@/hooks/useJobs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Job } from "@/lib/types";

const JOB_TYPES = [
    { id: "full-time", label: "Full Time" },
    { id: "part-time", label: "Part Time" },
    { id: "contract", label: "Contract" },
    { id: "internship", label: "Internship" },
    { id: "remote", label: "Remote" },
];

export default function JobsPage() {
    const { user, userRole } = useAuth();
    const { jobs, loading, addJob, deleteJob } = useJobs();
    const [isOpen, setIsOpen] = useState(false);
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

            await addJob({
                ...newJob,
                postedBy: user?.uid || "",
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
        } catch (error) {
            console.error("Error adding job:", error);
        }
    };

    const handleDelete = async (jobId: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            await deleteJob(jobId);
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Job Board</h1>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>Post Job</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Post a New Job</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Job Title *"
                                        value={newJob.title}
                                        onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Company Name *"
                                        value={newJob.company}
                                        onChange={(e) => setNewJob(prev => ({ ...prev, company: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Location"
                                        value={newJob.location}
                                        onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Select
                                        value={newJob.type}
                                        onValueChange={(value) => setNewJob(prev => ({ ...prev, type: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Job Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JOB_TYPES.map(type => (
                                                <SelectItem key={type.id} value={type.id}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Job Description *"
                                    value={newJob.description}
                                    onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Requirements (one per line)"
                                    value={newJob.requirements}
                                    onChange={(e) => setNewJob(prev => ({ ...prev, requirements: e.target.value }))}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        placeholder="Contact Email"
                                        value={newJob.contactEmail}
                                        onChange={(e) => setNewJob(prev => ({ ...prev, contactEmail: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Salary Range"
                                        value={newJob.salary}
                                        onChange={(e) => setNewJob(prev => ({ ...prev, salary: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Application Link"
                                        value={newJob.applicationLink}
                                        onChange={(e) => setNewJob(prev => ({ ...prev, applicationLink: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="date"
                                        placeholder="Application Deadline"
                                        value={newJob.deadline}
                                        onChange={(e) => setNewJob(prev => ({ ...prev, deadline: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full">
                                Post Job
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-6">
                {jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onDelete={userRole?.isAdmin ? handleDelete : undefined}
                    />
                ))}
                {jobs.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        No jobs posted yet
                    </div>
                )}
            </div>
        </div>
    );
} 