"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForum } from "@/hooks/useForum";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { MessageSquare, Edit2, Trash2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function ForumSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
    );
}

export default function ForumPage() {
    const { user, userRole } = useAuth();
    const { posts, loading, createPost, updatePost, deletePost, addComment, deleteComment } = useForum();
    const [isOpen, setIsOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        category: "general" as ForumPost["category"],
    });
    const [newComment, setNewComment] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPost) {
                await updatePost(editingPost.id, newPost);
                toast.success("Post updated successfully");
            } else {
                await createPost({
                    ...newPost,
                    author: user!.uid,
                });
                toast.success("Post created successfully");
            }

            setIsOpen(false);
            setNewPost({
                title: "",
                content: "",
                category: "general",
            });
            setEditingPost(null);
        } catch (error) {
            toast.error("Failed to save post");
            console.error("Error saving post:", error);
        }
    };

    const handleEdit = (post: ForumPost) => {
        setEditingPost(post);
        setNewPost({
            title: post.title,
            content: post.content,
            category: post.category,
        });
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePost(id);
            toast.success("Post deleted successfully");
        } catch (error) {
            toast.error("Failed to delete post");
            console.error("Error deleting post:", error);
        }
    };

    const handleComment = async (postId: string) => {
        try {
            const comment = newComment[postId];
            if (!comment?.trim()) return;

            await addComment(postId, {
                content: comment,
                author: user!.uid,
            });

            setNewComment((prev) => ({ ...prev, [postId]: "" }));
            toast.success("Comment added successfully");
        } catch (error) {
            toast.error("Failed to add comment");
            console.error("Error adding comment:", error);
        }
    };

    const handleDeleteComment = async (postId: string, commentId: string) => {
        try {
            await deleteComment(postId, commentId);
            toast.success("Comment deleted successfully");
        } catch (error) {
            toast.error("Failed to delete comment");
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Forum</h1>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>Create Post</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                placeholder="Title"
                                value={newPost.title}
                                onChange={(e) =>
                                    setNewPost({ ...newPost, title: e.target.value })
                                }
                                required
                            />
                            <Textarea
                                placeholder="Content"
                                value={newPost.content}
                                onChange={(e) =>
                                    setNewPost({ ...newPost, content: e.target.value })
                                }
                                required
                            />
                            <Select
                                value={newPost.category}
                                onValueChange={(value) =>
                                    setNewPost({ ...newPost, category: value as ForumPost["category"] })
                                }
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="career">Career</SelectItem>
                                    <SelectItem value="networking">Networking</SelectItem>
                                    <SelectItem value="memories">Memories</SelectItem>
                                    <SelectItem value="general">General</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit">
                                {editingPost ? "Update Post" : "Create Post"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="space-y-4">
                    <ForumSkeleton />
                    <ForumSkeleton />
                    <ForumSkeleton />
                </div>
            ) : posts.length === 0 ? (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">No posts yet</h3>
                            <p className="text-muted-foreground mt-1">
                                Start a discussion by creating a new post
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post.id}>
                            <CardHeader>
                                <CardTitle>{post.title}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="capitalize">{post.category}</span>
                                    <span>•</span>
                                    <span>
                                        {formatDistanceToNow(new Date(post.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{post.content}</p>
                                {post.comments.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        <h4 className="font-medium">Comments</h4>
                                        {post.comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="flex items-start gap-2 text-sm"
                                            >
                                                <MessageSquare className="h-4 w-4 mt-1" />
                                                <div className="flex-1">
                                                    <p>{comment.content}</p>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(comment.createdAt), {
                                                            addSuffix: true,
                                                        })}
                                                    </span>
                                                </div>
                                                {(userRole?.isAdmin || user?.uid === comment.author) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDeleteComment(post.id, comment.id)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex-col gap-4">
                                <div className="flex w-full gap-2">
                                    <Input
                                        placeholder="Add a comment..."
                                        value={newComment[post.id] || ""}
                                        onChange={(e) =>
                                            setNewComment((prev) => ({
                                                ...prev,
                                                [post.id]: e.target.value,
                                            }))
                                        }
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleComment(post.id)}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                                {(userRole?.isAdmin || user?.uid === post.author) && (
                                    <div className="flex w-full justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(post)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 