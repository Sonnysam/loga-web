"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDues } from "@/hooks/useDues";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePaystackPayment } from "react-paystack";
import { formatDistanceToNow } from "date-fns";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { differenceInDays } from "date-fns";

export default function DuesPage() {
    const { user, userData } = useAuth();
    const { payments, loading, isProcessing, processPayment } = useDues();
    const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);

    const config = {
        reference: `dues_${Date.now()}`,
        email: user?.email || "",
        amount: 1000, // 10 GHS in pesewas
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        currency: "GHS",
    };

    const onSuccess = (reference: any) => {
        processPayment(reference.reference);
        setIsPaymentInitiated(false);
    };

    const onClose = () => {
        setIsPaymentInitiated(false);
    };

    const initializePayment = usePaystackPayment(config);

    const handlePayment = () => {
        setIsPaymentInitiated(true);
        initializePayment(onSuccess, onClose);
    };

    const isPaymentDisabled = userData?.duesStatus === 'paid';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Monthly Dues</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {userData?.duesStatus === 'pending' && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Your monthly dues payment is pending
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Amount: GHS 10.00
                        </p>
                        {userData?.lastDuesPayment && (
                            <p className="text-sm text-muted-foreground">
                                Last Payment: {formatDistanceToNow(userData.lastDuesPayment.toDate(), { addSuffix: true })}
                            </p>
                        )}
                        {userData?.nextDueDate && userData?.duesStatus === "paid" && (
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Next Due: {formatDistanceToNow(userData.nextDueDate.toDate(), { addSuffix: true })}
                                </p>
                                <p className="text-sm font-medium text-green-600">
                                    Dues renew in {differenceInDays(userData.nextDueDate.toDate(), new Date())} days
                                </p>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handlePayment}
                        disabled={isPaymentDisabled || isProcessing || isPaymentInitiated}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Pay Dues'
                        )}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {payments.map((payment) => (
                            <div
                                key={payment.id}
                                className="flex justify-between items-center p-4 rounded-lg border"
                            >
                                <div>
                                    <p className="font-medium">GHS {payment.amount / 100}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(payment.paymentDate.toDate(), { addSuffix: true })}
                                    </p>
                                </div>
                                <div className="text-sm">
                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                                        {payment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {payments.length === 0 && (
                            <p className="text-center text-muted-foreground">
                                No payment history
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 