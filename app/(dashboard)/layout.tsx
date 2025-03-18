"use client";

import { ReactNode } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen">
                <DashboardSidebar />
                <main className="md:pl-64 pt-16 p-4 max-w-7xl mx-auto">{children}</main>
            </div>
        </ProtectedRoute>
    );
} 