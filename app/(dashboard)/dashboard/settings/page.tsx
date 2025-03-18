"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
    const { userData, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: userData?.name || "",
        phoneNumber: userData?.phoneNumber || "",
        occupation: userData?.occupation || "",
        institution: userData?.institution || "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!user) throw new Error("No user found");

            await updateDoc(doc(db, "users", user.uid), {
                ...profileData,
                updatedAt: new Date().toISOString(),
            });

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
            console.error("Error updating profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!user?.email) throw new Error("No user found");
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                throw new Error("Passwords don't match");
            }

            const credential = EmailAuthProvider.credential(
                user.email,
                passwordData.currentPassword
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, passwordData.newPassword);

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            toast.success("Password updated successfully");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to update password";

            toast.error(
                errorMessage === "auth/wrong-password"
                    ? "Current password is incorrect"
                    : errorMessage
            );
            console.error("Error updating password:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={profileData.name}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, name: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                value={profileData.phoneNumber}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, phoneNumber: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Input
                                id="occupation"
                                value={profileData.occupation}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, occupation: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="institution">Institution</Label>
                            <Input
                                id="institution"
                                value={profileData.institution}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, institution: e.target.value })
                                }
                                required
                            />
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Profile"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 