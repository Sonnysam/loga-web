"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useEvents } from "@/hooks/useEvents";
import { Loader2, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function EventsPage() {
    const { user, userRole } = useAuth();
    const { events, loading, addEvent, deleteEvent } = useEvents();
    const [isOpen, setIsOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        date: "",
        venue: "",
        time: "",
        registrationLink: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!newEvent.title.trim() || !newEvent.description.trim() || !newEvent.date || !newEvent.venue.trim()) {
                toast.error("Please fill in all required fields");
                return;
            }

            await addEvent({
                ...newEvent,
                createdBy: user?.uid || "",
            });

            setIsOpen(false);
            setNewEvent({
                title: "",
                description: "",
                date: "",
                venue: "",
                time: "",
                registrationLink: "",
            });
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const handleDelete = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent(eventId);
        } catch (error) {
            console.error("Error deleting event:", error);
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
                <h1 className="text-2xl font-bold">Events</h1>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>Create Event</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Event Title *"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input
                                        type="date"
                                        placeholder="Date *"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="time"
                                        placeholder="Time"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Input
                                    placeholder="Venue *"
                                    value={newEvent.venue}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, venue: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Event Description *"
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Input
                                    placeholder="Registration Link"
                                    value={newEvent.registrationLink}
                                    onChange={(e) => setNewEvent(prev => ({ ...prev, registrationLink: e.target.value }))}
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Create Event
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {events.map((event) => (
                    <Card key={event.id}>
                        <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Posted {formatDistanceToNow(event.createdAt.toDate(), { addSuffix: true })}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm">{event.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(event.date).toLocaleDateString()}
                                    {event.time && ` at ${event.time}`}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {event.venue}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {event.registrationLink && (
                                <Button asChild variant="outline">
                                    <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                                        Register
                                    </a>
                                </Button>
                            )}
                            {(userRole?.isAdmin || user?.uid === event.createdBy) && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(event.id)}
                                >
                                    Delete
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
                {events.length === 0 && (
                    <div className="col-span-2 text-center py-10 text-muted-foreground">
                        No events scheduled yet
                    </div>
                )}
            </div>
        </div>
    );
} 