"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ForumPost } from "@/lib/types";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";

interface ManagePostsProps {
    posts: ForumPost[];
}

export function ManagePosts({ posts }: ManagePostsProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (postId: string) => {
        try {
            setIsDeleting(true);
            await deleteDoc(doc(db, "forum", postId));
            toast.success("Post deleted successfully");
        } catch (error) {
            toast.error("Failed to delete post");
            console.error("Error deleting post:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Forum Posts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex items-center justify-between p-4 rounded-lg border"
                        >
                            <div>
                                <h3 className="font-medium">{post.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {post.category} • {post.comments.length} comments
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Posted {formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(post.id)}
                                    disabled={isDeleting}
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