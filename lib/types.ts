import { Timestamp } from "firebase/firestore";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  createdBy: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  postedBy: string;
  postedAt: Timestamp;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: "general" | "career" | "networking" | "memories";
  author: string;
  createdAt: Timestamp;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Timestamp;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  yearGroup: string;
  occupation: string;
  institution: string;
  isAdmin: boolean;
  createdAt: string;
}
