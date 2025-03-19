"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  addDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "./useAuth";
import { useDuesStore } from "@/lib/stores/duesStore";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";

export function useDues() {
  const { user } = useAuth();
  const { payments, setPayments, loading, setLoading } = useDuesStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [daysUntilRenewal, setDaysUntilRenewal] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "dues"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const duesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(duesList);
      setLoading(false);

      // Calculate days until renewal
      const latestPayment = duesList[0];
      if (latestPayment?.nextDueDate) {
        const daysLeft = differenceInDays(latestPayment.nextDueDate.toDate(), new Date());
        setDaysUntilRenewal(daysLeft);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const processPayment = async (reference: string) => {
    if (!user) return;
    setIsProcessing(true);

    try {
      const nextDueDate = new Date();
      nextDueDate.setDate(nextDueDate.getDate() + 30); // Set next due date to 30 days from now

      const payment = {
        userId: user.uid,
        amount: 1000, // 10 GHS in pesewas
        status: "paid",
        paymentDate: Timestamp.now(),
        nextDueDate: Timestamp.fromDate(nextDueDate),
        reference,
      };

      // Add payment record
      await addDoc(collection(db, "dues"), payment);

      // Update user's dues status
      await updateDoc(doc(db, "users", user.uid), {
        lastDuesPayment: Timestamp.now(),
        nextDueDate: Timestamp.fromDate(nextDueDate),
        duesStatus: "paid",
      });

      // Update days until renewal
      setDaysUntilRenewal(30);

      toast.success("Dues payment successful");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    payments,
    loading,
    isProcessing,
    daysUntilRenewal,
    processPayment,
  };
}
