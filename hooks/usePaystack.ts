"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export function usePaystack() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializePayment = (config: {
    email: string;
    amount: number;
    reference: string;
    onSuccess: (reference: string) => void;
    onClose: () => void;
  }) => {
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: config.email,
      amount: config.amount,
      ref: config.reference,
      callback: (response: { reference: string }) => {
        config.onSuccess(response.reference);
      },
      onClose: () => {
        config.onClose();
      },
    });
    handler.openIframe();
  };

  return { initializePayment };
}
