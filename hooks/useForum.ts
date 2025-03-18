import { useEffect, useState } from "react";
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
  Timestamp,
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

  const deletePost = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "forum", id));
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  const updatePost = async (
    id: string,
    data: Partial<Omit<ForumPost, "id">>
  ): Promise<void> => {
    try {
      await updateDoc(doc(db, "forum", id), data);
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  };

  const addComment = async (
    postId: string,
    comment: Omit<Comment, "id" | "createdAt">
  ): Promise<void> => {
    try {
      const postRef = doc(db, "forum", postId);
      const newComment = {
        ...comment,
        id: crypto.randomUUID(),
        createdAt: serverTimestamp() as Timestamp,
      };

      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  return {
    posts,
    loading,
    deletePost,
    updatePost,
    addComment,
  };
}
