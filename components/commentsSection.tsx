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
  const [parentCommentId, setParentCommentId] = useState<number | null>(null); // Add state for parentCommentId if needed

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

    // Retrieve the logged-in user from localStorage
    const storedUser = localStorage.getItem("user");

    // Check if the user exists
    if (!storedUser) {
      setError("Please log in to comment");
      return;
    }

    const { username } = JSON.parse(storedUser); // Extract the username from stored user data

    const newComment: ThreadComment = {
      id: Date.now(),
      thread: thread.id,
      content: commentContent,
      creator: { userName: username }, // Use the stored username here
      creationDate: new Date().toISOString(),
      replies: [],
      // parentCommentId: parentCommentId ?? undefined,
    };

    // Update comments for the current thread
    const updatedComments = [...comments, newComment];
    console.log("Updated Comments List:", updatedComments); // Log updated comments list
    setComments(updatedComments);

    // Save all comments but with proper filtering applied
    const allComments = getCommentsFromLocalStorage();
    const updatedAllComments = [
      ...allComments.filter((comment) => comment.thread !== thread.id),
      ...updatedComments,
    ];

    console.log("Saving Updated All Comments:", updatedAllComments); // Log comments to be saved
    saveCommentsToLocalStorage(updatedAllComments);
    setCommentContent("");
    setParentCommentId(null); // Reset parentCommentId after adding comment
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
    // Retrieve the logged-in user from localStorage
    const storedUser = localStorage.getItem("user");

    // Check if the user exists
    if (!storedUser) {
      setError("Please log in to reply");
      return;
    }

    const { username } = JSON.parse(storedUser); // Extract the username from stored user data

    const newReply: ThreadComment = {
      id: Date.now(),
      thread: thread.id,
      content,
      creator: { userName: username }, // Use the stored username here
      creationDate: new Date().toISOString(),
      replies: [],
      parentCommentId: parentId, // Include parentCommentId here
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

    // Log the new reply and the updated comments
    console.log("New Reply Added:", newReply);
    console.log("Updated Comments:", updatedComments);

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
            className="w-full bg-gray-800 border border-gray-600 rounded p-2 mt-4 text-white placeholder-gray-400"
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
