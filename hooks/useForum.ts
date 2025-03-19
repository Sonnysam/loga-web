"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import type { ForumPost, Comment } from "@/lib/types";
import { toast } from "sonner";

export function useForum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "forum"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ForumPost[];
        setPosts(postsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching forum posts:", error);
        toast.error("Failed to load forum posts");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addPost = async (data: Omit<ForumPost, "id" | "createdAt" | "comments">) => {
    try {
      await addDoc(collection(db, "forum"), {
        ...data,
        createdAt: serverTimestamp(),
        comments: [],
      });
      toast.success("Post created successfully");
    } catch (error) {
      console.error("Error adding post:", error);
      toast.error("Failed to create post");
      throw error;
    }
  };

  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "forum", id));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
      throw error;
    }
  };

  const addComment = async (postId: string, comment: Omit<Comment, "id" | "createdAt">) => {
    try {
      const postRef = doc(db, "forum", postId);

      // Create comment with a regular timestamp instead of serverTimestamp
      const newComment = {
        ...comment,
        id: crypto.randomUUID(),
        createdAt: new Date(), // Changed from serverTimestamp()
      };

      // Update the post with the new comment
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });

      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      throw error;
    }
  };

  return {
    posts,
    loading,
    addPost,
    deletePost,
    addComment,
  };
}
