"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEvents } from "@/hooks/useEvents";
import { toast } from "sonner";

export default function EventsPage() {
    const { user, userRole } = useAuth();
    const { events } = useEvents();
    const [isOpen, setIsOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        date: "",
        venue: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "events"), {
                ...newEvent,
                createdBy: user?.uid,
                createdAt: serverTimestamp(),
            });
            setIsOpen(false);
            setNewEvent({ title: "", description: "", date: "", venue: "" });
            toast.success("Event created successfully!");
        } catch (error) {
            toast.error("Failed to create event. Please try again.");
            console.error("Error adding event:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Events</h1>
                {userRole?.isAdmin && (
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>Create Event</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Event</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    placeholder="Event Title"
                                    value={newEvent.title}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, title: e.target.value })
                                    }
                                />
                                <Textarea
                                    placeholder="Description"
                                    value={newEvent.description}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, description: e.target.value })
                                    }
                                />
                                <Input
                                    type="datetime-local"
                                    value={newEvent.date}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, date: e.target.value })
                                    }
                                />
                                <Input
                                    placeholder="Venue"
                                    value={newEvent.venue}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, venue: e.target.value })
                                    }
                                />
                                <Button type="submit">Create Event</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card key={event.id}>
                        <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-2">{event.description}</p>
                            <div className="space-y-1">
                                <p className="text-sm">
                                    <strong>Date:</strong>{" "}
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm">
                                    <strong>Venue:</strong> {event.venue}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 