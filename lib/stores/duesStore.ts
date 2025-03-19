import { create } from "zustand";
import { DuesPayment } from "@/lib/types";

interface DuesState {
  payments: DuesPayment[];
  loading: boolean;
  setPayments: (payments: DuesPayment[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useDuesStore = create<DuesState>((set) => ({
  payments: [],
  loading: true,
  setPayments: (payments) => set({ payments }),
  setLoading: (loading) => set({ loading }),
}));
