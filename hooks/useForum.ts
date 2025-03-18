import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { ForumPost, Comment } from "@/lib/types";

export function useForum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "forum"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ForumPost[];

      setPosts(postsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createPost = async (
    data: Omit<ForumPost, "id" | "createdAt" | "comments">
  ) => {
    try {
      await addDoc(collection(db, "forum"), {
        ...data,
        createdAt: serverTimestamp(),
        comments: [],
      });
    } catch (error) {
      throw error;
    }
  };

  const updatePost = async (id: string, data: Partial<ForumPost>) => {
    try {
      await updateDoc(doc(db, "forum", id), data);
    } catch (error) {
      throw error;
    }
  };

  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "forum", id));
    } catch (error) {
      throw error;
    }
  };

  const addComment = async (
    postId: string,
    comment: Omit<Comment, "id" | "createdAt">
  ) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) throw new Error("Post not found");

      const newComment = {
        id: Math.random().toString(36).substr(2, 9),
        ...comment,
        createdAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "forum", postId), {
        comments: [...post.comments, newComment],
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) throw new Error("Post not found");

      await updateDoc(doc(db, "forum", postId), {
        comments: post.comments.filter((c) => c.id !== commentId),
      });
    } catch (error) {
      throw error;
    }
  };

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    addComment,
    deleteComment,
  };
}
