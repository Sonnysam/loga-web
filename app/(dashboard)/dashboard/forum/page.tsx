"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForumPost } from "@/components/forum/ForumPost";
import { useForum } from "@/hooks/useForum";
import { ForumSkeleton } from "@/components/forum/ForumSkeleton";
import { toast } from "sonner";
import type { ForumPost as ForumPostType } from "@/lib/types";

const FORUM_CATEGORIES = [
    { id: "general" as const, label: "General Discussion" },
    { id: "career" as const, label: "Career" },
    { id: "networking" as const, label: "Networking" },
    { id: "memories" as const, label: "Memories" },
] as const;

export default function ForumPage() {
    const { user } = useAuth();
    const { posts, loading, addPost, addComment } = useForum();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("general");
    const [newPost, setNewPost] = useState<{
        title: string;
        content: string;
        category: ForumPostType['category'];
    }>({
        title: "",
        content: "",
        category: "general",
    });

    const filteredPosts = selectedCategory === "all"
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.title.trim() || !newPost.content.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            await addPost({
                ...newPost,
                author: user?.uid || "",
                authorName: user?.displayName || "",
            });
            setIsOpen(false);
            setNewPost({ title: "", content: "", category: "general" });
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <ForumSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Tabs defaultValue="general" onValueChange={setSelectedCategory}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        {FORUM_CATEGORIES.map(category => (
                            <TabsTrigger key={category.id} value={category.id}>
                                {category.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>Create Post</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Post</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Title"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Select
                                    value={newPost.category}
                                    onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FORUM_CATEGORIES.map(category => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Write your post..."
                                    value={newPost.content}
                                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                                    rows={5}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Post
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {filteredPosts.map((post) => (
                    <ForumPost
                        key={post.id}
                        post={post}
                        onAddComment={addComment}
                    />
                ))}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        No posts in this category yet
                    </div>
                )}
            </div>
        </div>
    );
} 