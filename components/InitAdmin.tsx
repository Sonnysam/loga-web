"use client";

import { useEffect } from "react";
import { createAdminAccount } from "@/hooks/useAuth";

export function InitAdmin() {
    useEffect(() => {
        createAdminAccount();
    }, []);

    return null;
} 