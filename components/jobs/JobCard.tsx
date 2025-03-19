"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

interface JobCardProps {
    job: Job;
    onDelete?: (id: string) => Promise<void>;
}

export function JobCard({ job, onDelete }: JobCardProps) {
    const { userRole } = useAuth();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <p className="text-base font-medium text-muted-foreground mt-1">
                            {job.company}
                        </p>
                    </div>
                    <Badge variant="outline">{job.type}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                    </div>
                    {job.salary && (
                        <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.salary}
                        </div>
                    )}
                    {job.deadline && (
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h4 className="font-medium">Description</h4>
                    <p className="text-sm">{job.description}</p>
                </div>

                {job.requirements.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium">Requirements</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {job.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="space-x-2">
                    {job.applicationLink && (
                        <Button asChild>
                            <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Apply Now
                            </a>
                        </Button>
                    )}
                    {job.contactEmail && (
                        <Button variant="outline" asChild>
                            <a href={`mailto:${job.contactEmail}`}>
                                Contact
                            </a>
                        </Button>
                    )}
                </div>
                {userRole?.isAdmin && onDelete && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(job.id)}
                    >
                        Delete
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
} 