"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Briefcase, MessageSquare, Settings, LogOut, Menu, X, Shield } from "lucide-react";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

    return (
        <>
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur z-50 flex md:hidden items-center px-4">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <nav className="flex flex-col h-full">
                            <div className="p-4 border-b">
                                <h2 className="font-semibold">LOGA Alumni Portal</h2>
                            </div>
                            <div className="flex-1 px-2 py-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                            pathname === item.href
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                            <div className="p-4 border-t">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3"
                                    onClick={() => auth.signOut()}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex-1 flex justify-center">
                    <h1 className="font-semibold">LOGA Alumni Portal</h1>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="fixed hidden md:flex h-screen w-64 flex-col border-r bg-background">
                <div className="p-6 border-b">
                    <h2 className="font-semibold">LOGA Alumni Portal</h2>
                </div>
                <nav className="flex-1 px-4 py-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors mb-1",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-6 border-t">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3"
                        onClick={() => auth.signOut()}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>
        </>
    );
} 