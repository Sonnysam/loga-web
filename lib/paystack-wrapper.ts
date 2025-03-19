"use client";
import { on } from "events";
import { usePaystackPayment } from "react-paystack";

interface PaystackWrapperProps {
  config: any;
  onSuccess: () => void;
  onClose: () => void;
}

const PaystackWrapper: React.FC<PaystackWrapperProps> = ({ config, onSuccess, onClose }) => {
  const initializePayment = usePaystackPayment(config);

  const options = {
    onSuccess,
    onClose,
  };

  const handlePayment = () => {
    initializePayment(options);
  };

  return (
    <button
      onClick={handlePayment}
      className="flex w-full justify-center rounded-md bg-black px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      Pay Now
    </button>
  );
};

export default PaystackWrapper;
