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
  // Initialize comments for the specific thread
  const [comments, setComments] = useState<ThreadComment[]>(() =>
    initialComments.filter((comment) => comment.thread === thread.id)
  );
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showCensored] = useState(true);

  useEffect(() => {
    // Fetch and filter comments from local storage when thread ID changes
    const storedComments = getCommentsFromLocalStorage();
    setComments(
      storedComments.filter((comment) => comment.thread === thread.id)
    );
  }, [thread.id]);

  const handleAddComment = () => {
    if (commentContent.trim() === "") {
      setError("Comment cannot be empty");
      return;
    }

    const newComment: ThreadComment = {
      id: Date.now(),
      thread: thread.id,
      content: commentContent,
      creator: { userName: "guest" },
      creationDate: new Date().toISOString(),
      replies: [],
    };

    // Update comments for the current thread
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    // Save all comments but with proper filtering applied
    const allComments = getCommentsFromLocalStorage();
    const updatedAllComments = [
      ...allComments.filter((comment) => comment.thread !== thread.id),
      ...updatedComments,
    ];
    saveCommentsToLocalStorage(updatedAllComments);
    setCommentContent("");
    onAddComment(newComment);
    setError(null);
  };

  const handleCommentSelection = (selectedComment: ThreadComment) => {
    // Move the selected comment to the top
    const updatedComments = comments.filter(
      (comment) => comment.id !== selectedComment.id
    );
    setComments([selectedComment, ...updatedComments]);
    saveCommentsToLocalStorage([selectedComment, ...updatedComments]);
  };

  const handleAddReply = (parentId: number, content: string) => {
    const newReply: ThreadComment = {
      id: Date.now(),
      thread: thread.id,
      content,
      creator: { userName: "guest" },
      creationDate: new Date().toISOString(),
      replies: [],
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
            className="w-full border rounded p-2 mt-4 text-black"
            disabled={isLocked}
          />
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
