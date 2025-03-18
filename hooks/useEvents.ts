import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import type { Event } from "@/lib/types";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      setEvents(eventsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteEvent = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "events", id));
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };

  const updateEvent = async (id: string, data: Partial<Omit<Event, "id">>): Promise<void> => {
    try {
      await updateDoc(doc(db, "events", id), data);
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  return { events, loading, deleteEvent, updateEvent };
}
