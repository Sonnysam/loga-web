"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Shield } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/lib/types";
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ManageUsersProps {
    userCount: number;
}

export function ManageUsers({ userCount }: ManageUsersProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as User[];
            setUsers(usersList);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleAdmin = async (userId: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, "users", userId), {
                isAdmin: !currentStatus,
            });
            toast.success("User admin status updated");
        } catch (error) {
            toast.error("Failed to update user status");
            console.error("Error updating user:", error);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await deleteDoc(doc(db, "users", userId));
            toast.success("User deleted successfully");
        } catch (error) {
            toast.error("Failed to delete user");
            console.error("Error deleting user:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Users ({userCount})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-4 rounded-lg border"
                        >
                            <div>
                                <h3 className="font-medium">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <p className="text-xs text-muted-foreground">
                                    {user.yearGroup} • {user.occupation}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={user.isAdmin ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleAdmin(user.id, user.isAdmin)}
                                >
                                    <Shield className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 