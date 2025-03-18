"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Briefcase, MessageSquare, Settings, LogOut, Menu, X, Shield } from "lucide-react";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardSidebar() {
    const { userRole } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/dashboard/events", label: "Events", icon: Calendar },
        { href: "/dashboard/jobs", label: "Job Board", icon: Briefcase },
        { href: "/dashboard/forum", label: "Forum", icon: MessageSquare },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
        ...(userRole?.isAdmin
            ? [{ href: "/dashboard/admin", label: "Admin", icon: Shield }]
            : []),
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center gap-4 px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    <h2 className="text-lg font-semibold">LOGA Alumni Portal</h2>
                </div>
            </div>

            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 pt-16",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full p-4">
                    <div className="mb-8 pt-4">
                        <h2 className="text-2xl font-bold text-center">Alumni Portal</h2>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                                        isActive(item.href)
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-accent"
                                    )}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <Button
                        variant="ghost"
                        className="flex items-center gap-3 text-destructive hover:bg-destructive/10 mt-auto"
                        onClick={() => {
                            auth.signOut();
                            setIsOpen(false);
                        }}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>
        </>
    );
} 