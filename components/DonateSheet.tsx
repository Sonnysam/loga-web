"use client";

import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "sonner";

const PREDEFINED_AMOUNTS = [
    { label: "GHS 50", value: 5000 },
    { label: "GHS 100", value: 10000 },
    { label: "GHS 500", value: 50000 },
];

export function DonateSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState<number | "">("");
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    const config = {
        reference: `donate_${Date.now()}`,
        email: email,
        amount: typeof amount === "number" ? amount * 100 : selectedAmount || 0,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        currency: "GHS",
    };

    const onSuccess = () => {
        toast.success("Thank you for your donation!");
        setIsOpen(false);
        resetForm();
    };

    const onClose = () => {
        toast.error("Transaction cancelled");
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setAmount("");
        setSelectedAmount(null);
    };

    const initializePayment = usePaystackPayment(config);

    const handleDonate = () => {
        if (!name || !email || (!amount && !selectedAmount)) {
            toast.error("Please fill in all fields");
            return;
        }
        initializePayment(onSuccess, onClose);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button className="bg-[#2E008F] text-white hover:bg-[#2E008F]/90">
                    <Heart className="mr-1 h-4 w-4" />
                    Donate
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Support LOGA</SheetTitle>
                    <SheetDescription>
                        Your donation helps support our alumni community and various initiatives.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className="space-y-4">
                        <Label>Select Amount</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {PREDEFINED_AMOUNTS.map((preset) => (
                                <Button
                                    key={preset.value}
                                    variant={selectedAmount === preset.value ? "default" : "outline"}
                                    onClick={() => {
                                        setSelectedAmount(preset.value);
                                        setAmount("");
                                    }}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="custom-amount">Or enter custom amount (GHS)</Label>
                            <Input
                                id="custom-amount"
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(Number(e.target.value));
                                    setSelectedAmount(null);
                                }}
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>
                    <Button onClick={handleDonate} className="w-full">
                        Donate Now
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
} 