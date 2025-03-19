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
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare } from "lucide-react";

type Category = ForumPostType['category'];

const FORUM_CATEGORIES = [
    { id: "general" as Category, label: "General Discussion" },
    { id: "career" as Category, label: "Career" },
    { id: "networking" as Category, label: "Networking" },
    { id: "memories" as Category, label: "Memories" },
] as const;

export default function ForumPage() {
    const { user } = useAuth();
    const { posts, loading, addPost, addComment } = useForum();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | "all">("general");
    const [newPost, setNewPost] = useState<{
        title: string;
        content: string;
        category: Category;
    }>({
        title: "",
        content: "",
        category: "general",
    });
    const [searchQuery, setSearchQuery] = useState("");

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
                <Tabs defaultValue="general" onValueChange={(value: Category | "all") => setSelectedCategory(value)}>
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
                                    onValueChange={(value: Category) => setNewPost(prev => ({ ...prev, category: value }))}
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
                    <EmptyState
                        icon={MessageSquare}
                        title={searchQuery ? "No posts found" : "No posts in this category"}
                        description={searchQuery
                            ? "Try adjusting your search terms or check a different category."
                            : "Be the first to start a discussion in this category!"
                        }
                        action={!searchQuery ? {
                            label: "Create Post",
                            onClick: () => setIsOpen(true)
                        } : undefined}
                        className="min-h-[400px] bg-muted/50"
                    />
                )}
            </div>
        </div>
    );
} 