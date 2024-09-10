import React, { useState, useEffect } from "react";
import CommentCard from "./commentCard";
import {
  saveCommentsToLocalStorage,
  getCommentsFromLocalStorage,
} from "@/utils/localStorage";

type CommentsSectionProps = {
  thread: Thread;
  initialComments: ThreadComment[];
  onAddComment: (comment: ThreadComment) => void;
  isLocked: boolean;
};

const CommentsSection: React.FC<CommentsSectionProps> = ({
  thread,
  initialComments,
  onAddComment,
  isLocked,
}) => {
  const [comments, setComments] = useState<ThreadComment[]>(() =>
    initialComments.filter((comment) => comment.thread === thread.id)
  );
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showCensored] = useState(true);
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);

  useEffect(() => {
    const storedComments = getCommentsFromLocalStorage();
    const threadComments = storedComments.filter(
      (comment) => comment.thread === thread.id
    );
    const sortedComments = threadComments.sort((a, b) =>
      b.isAnswer && !a.isAnswer ? 1 : !b.isAnswer && a.isAnswer ? -1 : 0
    );
    setComments(sortedComments);
  }, [thread.id]);

  const handleAddComment = () => {
    if (commentContent.trim() === "") {
      setError("Comment cannot be empty");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("Please log in to comment");
      return;
    }

    const { username } = JSON.parse(storedUser);

    const newComment: ThreadComment = {
      id: Date.now(),
      thread: thread.id,
      content: commentContent,
      creator: { userName: username },
      creationDate: new Date().toISOString(),
      replies: [],
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);

    const allComments = getCommentsFromLocalStorage();
    const updatedAllComments = [
      ...allComments.filter((comment) => comment.thread !== thread.id),
      ...updatedComments,
    ];

    saveCommentsToLocalStorage(updatedAllComments);
    setCommentContent("");
    setParentCommentId(null);
    onAddComment(newComment);
    setError(null);
  };

  const handleCommentSelection = (selectedComment: ThreadComment) => {
    // Mark/unmark comment as answer
    const updatedComments = comments.map((comment) =>
      comment.id === selectedComment.id
        ? { ...comment, isAnswer: !comment.isAnswer }
        : comment
    );

    // Move the marked comment to the top
    const sortedComments = updatedComments.sort((a, b) =>
      b.isAnswer && !a.isAnswer ? 1 : !b.isAnswer && a.isAnswer ? -1 : 0
    );

    setComments(sortedComments);

    // Update local storage
    const allComments = getCommentsFromLocalStorage();
    const updatedAllComments = allComments.map((comment) =>
      comment.thread === thread.id
        ? updatedComments.find((c) => c.id === comment.id) || comment
        : comment
    );

    saveCommentsToLocalStorage(updatedAllComments);
  };

  const handleAddReply = (parentId: number, content: string) => {
    console.log(`Adding reply to comment with parentCommentId: ${parentId}`); // Log the parentCommentId

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("Please log in to reply");
      return;
    }

    const { username } = JSON.parse(storedUser);

    const newReply: ThreadComment = {
      id: Date.now(),
      thread: thread.id,
      content,
      creator: { userName: username },
      creationDate: new Date().toISOString(),
      replies: [],
      parentCommentId: parentId,
    };

    const updateReplies = (comments: ThreadComment[]): ThreadComment[] => {
      return comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateReplies(comment.replies),
          };
        }
        return comment;
      });
    };

    const updatedComments = updateReplies(comments);
    setComments(updatedComments);

    const allComments = getCommentsFromLocalStorage();
    const updatedAllComments = [
      ...allComments.filter((comment) => comment.thread !== thread.id),
      ...updatedComments,
    ];
    saveCommentsToLocalStorage(updatedAllComments);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Comments</h2>

      <ul>
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            thread={thread}
            onSelect={handleCommentSelection}
            onAddReply={handleAddReply}
            showCensored={showCensored}
            isLocked={isLocked}
          />
        ))}
      </ul>

      {!isLocked && (
        <>
          <textarea
            placeholder="Add a comment"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full bg-gray-800 bg-opacity-50 border border-gray-600 rounded p-2 mt-4 text-white placeholder-gray-400"
            disabled={isLocked}
          />
          <button
            onClick={handleAddComment}
            className="mt-2 px-3 py-1.5 bg-black text-white text-xs border border-gray-400 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
            disabled={isLocked}
          >
            Add Comment
          </button>
        </>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CommentsSection;
