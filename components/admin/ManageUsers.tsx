"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Shield, Search } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/lib/types";
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ManageUsersProps {
    userCount: number;
}

const USERS_PER_PAGE = 5;

export function ManageUsers({ userCount }: ManageUsersProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

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
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, "users", userId));
            toast.success("User deleted successfully");
        } catch (error) {
            toast.error("Failed to delete user");
            console.error("Error deleting user:", error);
        }
    };

    // Filter users based on search query
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.yearGroup.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Manage Users ({userCount})</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                            className="pl-8"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {paginatedUsers.map((user) => (
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
                                    className={cn(
                                        user.isAdmin && "bg-green-600 hover:bg-green-700"
                                    )}
                                >
                                    <Shield className={cn(
                                        "h-4 w-4",
                                        user.isAdmin ? "text-white" : "text-muted-foreground"
                                    )} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(user.id)}
                                    className="hover:bg-red-100 hover:text-red-600 hover:border-red-600"
                                >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            {[...Array(totalPages)].map((_, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No users found
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 