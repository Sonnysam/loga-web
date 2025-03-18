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
} from "firebase/firestore";
import type { Job } from "@/lib/types";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("postedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Job[];

      setJobs(jobsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteJob = async (id: string) => {
    try {
      await deleteDoc(doc(db, "jobs", id));
    } catch (error) {
      throw error;
    }
  };

  const updateJob = async (id: string, data: Partial<Job>) => {
    try {
      await updateDoc(doc(db, "jobs", id), data);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  return { jobs, loading, deleteJob, updateJob };
}
