"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ForumPost as ForumPostType, Comment } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ForumPostProps {
    post: ForumPostType;
    onAddComment: (postId: string, comment: Omit<Comment, "id" | "createdAt">) => Promise<void>;
}

export function ForumPost({ post, onAddComment }: ForumPostProps) {
    const { user } = useAuth();
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !user) return;

        try {
            setIsSubmitting(true);
            await onAddComment(post.id, {
                content: comment,
                author: user.uid,
            });
            setComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Posted {formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}
                        </p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {post.category}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-base">{post.content}</p>

                <div className="space-y-4 mt-6">
                    <h4 className="font-medium">Comments ({post.comments.length})</h4>
                    <div className="space-y-3">
                        {post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {comment.author.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm">{comment.content}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <form onSubmit={handleSubmitComment} className="w-full space-y-2">
                    <Textarea
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comment
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
} 