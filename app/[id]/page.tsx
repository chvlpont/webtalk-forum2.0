"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import ThreadDetailHeader from "@/components/threadDetailHeader";
import CommentsSection from "@/components/commentsSection";
import {
  getCommentsFromLocalStorage,
  getThreadsFromLocalStorage,
  saveCommentToLocalStorage,
  saveThreadsToLocalStorage,
} from "@/utils/localStorage";

const ThreadPage = () => {
  const { id } = useParams();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const storedThreads = getThreadsFromLocalStorage();
      const selectedThread = storedThreads.find((t) => t.id === Number(id));
      setThread(selectedThread || null);

      const threadComments = getCommentsFromLocalStorage();
      setComments(
        threadComments.filter((comment) => comment.thread === Number(id))
      );
    }
  }, [id]);

  const handleAddComment = (newComment: ThreadComment) => {
    saveCommentToLocalStorage(newComment);
    setComments((prevComments) => [...prevComments, newComment]);

    if (thread) {
      const updatedThread = {
        ...thread,
        commentCount: thread.commentCount + 1,
      };
      setThread(updatedThread);

      const storedThreads = getThreadsFromLocalStorage();
      const updatedThreads = storedThreads.map((t) =>
        t.id === updatedThread.id ? updatedThread : t
      );
      saveThreadsToLocalStorage(updatedThreads);
    }
  };

  const scrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ThreadDetailHeader
        thread={thread}
        onCommentIconClick={scrollToComments}
      />
      <div ref={commentsRef}>
        <CommentsSection
          thread={thread} // Pass the thread prop
          initialComments={comments}
          onAddComment={handleAddComment}
          isLocked={thread.locked ?? false} // Ensure isLocked is provided
        />
      </div>
    </div>
  );
};

export default ThreadPage;
