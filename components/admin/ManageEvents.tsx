"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Event } from "@/lib/types";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";

interface ManageEventsProps {
    events: Event[];
}

export function ManageEvents({ events }: ManageEventsProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (eventId: string) => {
        try {
            setIsDeleting(true);
            await deleteDoc(doc(db, "events", eventId));
            toast.success("Event deleted successfully");
        } catch (error) {
            toast.error("Failed to delete event");
            console.error("Error deleting event:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Events</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center justify-between p-4 rounded-lg border"
                        >
                            <div>
                                <h3 className="font-medium">{event.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(event.createdAt.toDate(), { addSuffix: true })}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(event.id)}
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