import React, { useState, useEffect, MouseEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import { FaEllipsisH } from "react-icons/fa";

// Define the CommentCardProps type
type CommentCardProps = {
  comment: ThreadComment;
  onSelect: (comment: ThreadComment) => void;
  thread: Thread;
  onAddReply: (parentId: number, content: string) => void;
  showCensored: boolean;
  isLocked: boolean;
};

// Inappropriate words list
const inappropriateWords = [
  "damn",
  "hell",
  "crap",
  "bastard",
  "idiot",
  "stupid",
];

// Function to censor text
const censorText = (text: string): string => {
  return text
    .split(" ")
    .map((word) =>
      inappropriateWords.includes(word.toLowerCase()) ? "****" : word
    )
    .join(" ");
};

// Function to check if text requires censorship
const requiresCensorship = (text: string): boolean => {
  return text
    .split(" ")
    .some((word) => inappropriateWords.includes(word.toLowerCase()));
};

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onSelect,
  thread,
  onAddReply,
  showCensored,
  isLocked,
}) => {
  const cardKey = `comment-${comment.id}`;
  const [isSelected, setIsSelected] = useState(() => {
    const savedState = localStorage.getItem(cardKey);
    return savedState === "true";
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isCensored, setIsCensored] = useState(
    () => showCensored && requiresCensorship(comment.content)
  );

  useEffect(() => {
    localStorage.setItem(cardKey, JSON.stringify(isSelected));
  }, [isSelected, cardKey]);

  const handleIconClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  const handleDropdownItemClick = (action: string) => {
    if (action === "mark-as-answer") {
      setIsSelected(true);
      onSelect(comment);
    } else if (action === "unmark-as-answer") {
      setIsSelected(false);
      onSelect(comment);
    }
    setShowDropdown(false);
  };

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onAddReply(comment.id, replyContent);
      setReplyContent("");
      setIsReplyFormVisible(false);
    }
  };

  const isQNA = thread.category === "QNA";

  return (
    <div
      className={`relative border p-3 rounded-lg mb-2 ${
        isSelected ? "border-4 border-green-500" : "border border-gray-700"
      } bg-gray-800 bg-opacity-50 text-gray-200`}
    >
      {isSelected && isQNA && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs p-1 rounded-lg">
          Marked as answer
        </div>
      )}

      <div
        className="absolute top-2 right-2 cursor-pointer"
        onClick={handleIconClick}
      >
        <FaEllipsisH className="text-gray-400 hover:text-gray-300 transform rotate-90" />
      </div>

      {showDropdown && isQNA && (
        <div className="absolute top-8 right-2 bg-gray-800 bg-opacity-90 border border-gray-600 rounded-lg shadow-lg z-10">
          <button
            onClick={() =>
              handleDropdownItemClick(
                isSelected ? "unmark-as-answer" : "mark-as-answer"
              )
            }
            className="block px-4 py-2 text-gray-200 hover:bg-gray-700 w-full text-left"
          >
            {isSelected ? "Unmark as answer" : "Mark as answer"}
          </button>
        </div>
      )}

      <div className="flex items-center text-xs text-gray-400 mb-1">
        <span>u/{comment.creator.userName}</span>
        <span className="mx-1">•</span>
        <span>{formatDistanceToNow(new Date(comment.creationDate))} ago</span>
      </div>

      <p className="text-sm text-gray-200">
        {isCensored ? censorText(comment.content) : comment.content}
      </p>

      {requiresCensorship(comment.content) && (
        <div className="mt-2">
          <button
            onClick={() => setIsCensored((prev) => !prev)}
            className="text-gray-400 text-xs"
          >
            {isCensored ? "Show uncensored" : "Censor"}
          </button>
        </div>
      )}

      {!isLocked && (
        <>
          <button
            onClick={() => setIsReplyFormVisible((prev) => !prev)}
            className="text-blue-400 underline mt-2"
          >
            {isReplyFormVisible ? "Cancel Reply" : "Reply"}
          </button>

          {isReplyFormVisible && (
            <div className="mt-2">
              <textarea
                placeholder="Add a reply"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full border border-gray-600 rounded p-2 text-gray-200 bg-gray-900 placeholder-gray-500"
              />
              <button
                onClick={handleReplySubmit}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Reply
              </button>
            </div>
          )}
        </>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <ul className="mt-2 pl-4">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              thread={thread}
              onSelect={onSelect}
              onAddReply={onAddReply}
              showCensored={showCensored}
              isLocked={isLocked} // Pass isLocked down to replies
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentCard;
