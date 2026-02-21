"use client";

import React, { createContext, useContext, useState } from "react";
import { MOCK_ARTICLES, MOCK_COMMENTS, Article, Comment } from "../data/mockData";

interface BlogContextType {
  articles: Article[];
  comments: Comment[];
  addComment: (articleId: string, userId: string, username: string, content: string) => void;
  editComment: (id: string, content: string) => void;
  deleteComment: (id: string) => void;
  reportComment: (id: string, reason: string) => void;
  approveReport: (id: string) => void;
  rejectReport: (id: string) => void;
  getCommentsForArticle: (articleId: string) => Comment[];
  getReportedComments: () => Comment[];
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [articles] = useState<Article[]>(MOCK_ARTICLES ?? []);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS ?? []);

  const addComment = (articleId: string, userId: string, username: string, content: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      articleId,
      userId,
      username,
      content,
      date: new Date().toISOString().split("T")[0],
      reported: false,
      approved: null,
    };
    setComments((prev) => [...prev, newComment]);
  };

  const editComment = (id: string, content: string) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, content } : c)));
  };

  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const reportComment = (id: string, reason: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, reported: true, reportReason: reason } : c))
    );
  };

  const approveReport = (id: string) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, approved: true } : c)));
  };

  const rejectReport = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, approved: false, reported: false, reportReason: undefined } : c
      )
    );
  };

  const getCommentsForArticle = (articleId: string) =>
    comments.filter((c) => c.articleId === articleId && c.approved !== true);

  const getReportedComments = () => comments.filter((c) => c.reported && c.approved === null);

  const value: BlogContextType = {
    articles,
    comments,
    addComment,
    editComment,
    deleteComment,
    reportComment,
    approveReport,
    rejectReport,
    getCommentsForArticle,
    getReportedComments,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used within <BlogProvider>.");
  return ctx;
}