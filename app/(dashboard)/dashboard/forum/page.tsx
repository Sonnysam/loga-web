"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useForum } from "@/hooks/useForum";
import type { ForumPost } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const FORUM_CATEGORIES = [
    { id: "general", label: "General Discussion" },
    { id: "events", label: "Events" },
    { id: "jobs", label: "Career & Jobs" },
    { id: "alumni", label: "Alumni Network" },
    { id: "announcements", label: "Announcements" },
];

function ForumSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-20 w-full" />
            </CardContent>
        </Card>
    );
}

export default function ForumPage() {
    const { user, userRole } = useAuth();
    const { posts, loading, deletePost, addComment } = useForum();
    const [selectedCategory, setSelectedCategory] = useState("general");
    const [isOpen, setIsOpen] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        category: "general",
    });
    const [newComment, setNewComment] = useState("");
    const [commentingOn, setCommentingOn] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!newPost.title.trim() || !newPost.content.trim()) {
                toast.error("Please fill in all fields");
                return;
            }

            await addDoc(collection(db, "forum"), {
                ...newPost,
                createdBy: user?.uid,
                createdAt: serverTimestamp(),
                comments: [],
            });

            setIsOpen(false);
            setNewPost({ title: "", content: "", category: "general" });
            toast.success("Post created successfully!");
        } catch (error) {
            toast.error("Failed to create post");
            console.error("Error adding post:", error);
        }
    };

    const handleComment = async (postId: string) => {
        if (!newComment.trim()) {
            toast.error("Please write a comment");
            return;
        }

        try {
            await addComment(postId, {
                content: newComment,
                author: user?.uid || "",
            });
            toast.success("Comment added successfully");
            setNewComment("");
            setCommentingOn(null);
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment");
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await deletePost(postId);
            toast.success("Post deleted successfully");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post");
        }
    };

    const filteredPosts = posts.filter(
        (post) => selectedCategory === "all" || post.category === selectedCategory
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Forum</h1>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>Create New Post</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Post</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Select
                                    value={newPost.category}
                                    onValueChange={(value) =>
                                        setNewPost({ ...newPost, category: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FORUM_CATEGORIES.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Input
                                placeholder="Post title"
                                value={newPost.title}
                                onChange={(e) =>
                                    setNewPost({ ...newPost, title: e.target.value })
                                }
                            />
                            <Textarea
                                placeholder="Write your post..."
                                value={newPost.content}
                                onChange={(e) =>
                                    setNewPost({ ...newPost, content: e.target.value })
                                }
                                rows={5}
                            />
                            <Button type="submit">Post</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("all")}
                >
                    All
                </Button>
                {FORUM_CATEGORIES.map((category) => (
                    <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        {category.label}
                    </Button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredPosts.map((post) => (
                    <Card key={post.id}>
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Posted {formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{post.content}</p>

                            {post.comments.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    <h3 className="font-medium">Comments</h3>
                                    {post.comments.map((comment) => (
                                        <div key={comment.id} className="pl-4 border-l-2">
                                            <p>{comment.content}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-4">
                            {commentingOn === post.id ? (
                                <div className="w-full space-y-2">
                                    <Textarea
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleComment(post.id)}
                                        >
                                            Post Comment
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setCommentingOn(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCommentingOn(post.id)}
                                >
                                    Add Comment
                                </Button>
                            )}

                            {(userRole?.isAdmin || user?.uid === post.author) && (
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeletePost(post.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
} 