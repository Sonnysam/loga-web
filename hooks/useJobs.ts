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
import type { Job } from "@/lib/types";
import { toast } from "sonner";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("postedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const jobsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];
        setJobs(jobsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addJob = async (data: Omit<Job, "id" | "postedAt">) => {
    try {
      await addDoc(collection(db, "jobs"), {
        ...data,
        postedAt: serverTimestamp(),
      });
      toast.success("Job posted successfully");
    } catch (error) {
      console.error("Error adding job:", error);
      toast.error("Failed to post job");
      throw error;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await deleteDoc(doc(db, "jobs", id));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
      throw error;
    }
  };

  const updateJob = async (id: string, data: Partial<Omit<Job, "id">>) => {
    try {
      await updateDoc(doc(db, "jobs", id), data);
      toast.success("Job updated successfully");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job");
      throw error;
    }
  };

  return {
    jobs,
    loading,
    addJob,
    deleteJob,
    updateJob,
  };
}
