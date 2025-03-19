"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { Event } from "@/lib/types";
import { toast } from "sonner";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        setEvents(eventsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addEvent = async (data: Omit<Event, "id" | "createdAt">) => {
    try {
      await addDoc(collection(db, "events"), {
        ...data,
        createdAt: serverTimestamp(),
      });
      toast.success("Event created successfully");
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to create event");
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", id));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      throw error;
    }
  };

  const updateEvent = async (id: string, data: Partial<Omit<Event, "id">>) => {
    try {
      await updateDoc(doc(db, "events", id), data);
      toast.success("Event updated successfully");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      throw error;
    }
  };

  return {
    events,
    loading,
    addEvent,
    deleteEvent,
    updateEvent,
  };
}
