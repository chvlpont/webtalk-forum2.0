import React from "react";
import Link from "next/link";
import { FaRegCommentAlt, FaLock } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

type ThreadCardProps = {
  thread: Thread;
  isLoggedIn: boolean;
};

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, isLoggedIn }) => {
  // Define colors for categories
  const categoryColors = {
    QNA: "text-[#B7487E]", // Pink color for QNA
    THREAD: "text-[#48B781]", // Green color for THREAD
  };

  // Get the username from local storage
  const storedUser = isLoggedIn ? localStorage.getItem("user") : null;
  const username = storedUser ? JSON.parse(storedUser).username : "Anonymous";

  return (
    <li className="mb-4">
      {isLoggedIn ? (
        <Link
          href={`/${thread.id}`}
          className={`block p-4 rounded-lg shadow-lg transition duration-300 ease-in-out border ${
            thread.locked
              ? "bg-gray-900 bg-opacity-60 border-gray-600 cursor-pointer"
              : "bg-gray-800 bg-opacity-50 border-gray-700 hover:bg-opacity-70 hover:shadow-xl"
          }`}
        >
          <p
            className={`text-xs font-bold mb-1 ${
              categoryColors[thread.category] || "text-gray-300"
            }`}
          >
            r/{thread.category}
          </p>

          <div className="flex items-center text-xs text-gray-400 mb-2">
            <span>u/{username}</span>
            <span className="mx-1">•</span>
            <span>
              {formatDistanceToNow(new Date(thread.creationDate))} ago
            </span>
          </div>

          <h2 className="text-lg font-semibold text-white">{thread.title}</h2>
          <p className="text-sm text-gray-300 line-clamp-3">
            {thread.description}
          </p>

          <div className="flex items-center text-xs text-gray-400 mt-3">
            <div className="flex items-center justify-center bg-gray-700 bg-opacity-60 rounded-full px-3 py-1.5">
              <FaRegCommentAlt className="text-lg mr-1.5 text-gray-300" />
              <span className="text-sm font-semibold text-gray-300">
                {thread.commentCount}
              </span>
            </div>
            {/* Show lock icon if thread is locked */}
            {thread.locked && (
              <FaLock className="ml-2 text-red-500" title="Thread is locked" />
            )}
          </div>

          {/* Show locked notice inside the thread, but still clickable */}
          {thread.locked && (
            <p className="text-sm text-red-500 mt-2">
              This thread is locked. No further interaction allowed.
            </p>
          )}
        </Link>
      ) : (
        <div
          className="block bg-gray-800 bg-opacity-50 border border-gray-700 p-4 rounded-lg shadow-lg relative group"
          title="Log in to view thread"
        >
          <p
            className={`text-xs font-bold mb-1 ${
              categoryColors[thread.category] || "text-gray-300"
            }`}
          >
            r/{thread.category}
          </p>

          <div className="flex items-center text-xs text-gray-400 mb-2">
            <span>u/{username}</span>
            <span className="mx-1">•</span>
            <span>
              {formatDistanceToNow(new Date(thread.creationDate))} ago
            </span>
          </div>

          <h2 className="text-lg font-semibold text-white">{thread.title}</h2>
          <p className="text-sm text-gray-300 line-clamp-3">
            {thread.description}
          </p>

          <div className="flex items-center text-xs text-gray-400 mt-3">
            <div className="flex items-center justify-center bg-gray-700 bg-opacity-60 rounded-full px-3 py-1.5">
              <FaRegCommentAlt className="text-lg mr-1.5 text-gray-300" />
              <span className="text-sm font-semibold text-gray-300">
                {thread.commentCount}
              </span>
            </div>
          </div>

          {/* Hover overlay for non-logged-in users */}
          <div className="absolute inset-0 bg-gray-900 bg-opacity-80 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <span className="text-white text-sm">
              Log in to view or interact with thread
            </span>
          </div>
        </div>
      )}
    </li>
  );
};

export default ThreadCard;
