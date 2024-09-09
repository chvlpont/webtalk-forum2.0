import React from "react";
import Link from "next/link";
import { FaRegCommentAlt, FaLock } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

type ThreadCardProps = {
  thread: Thread;
  isLoggedIn: boolean;
};

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, isLoggedIn }) => {
  return (
    <li>
      {isLoggedIn ? (
        <Link
          href={`/${thread.id}`}
          className={`block p-4 rounded-lg shadow-sm transition duration-200 ease-in-out border ${
            thread.locked
              ? "bg-gray-200 border-gray-400 cursor-pointer"
              : "bg-white border-gray-300 hover:shadow-lg hover:bg-gray-300"
          }`}
        >
          <p className="text-xs font-bold text-gray-600 mb-1">
            r/{thread.category}
          </p>

          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span>u/Username</span>
            <span className="mx-1">•</span>
            <span>
              {formatDistanceToNow(new Date(thread.creationDate))} ago
            </span>
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            {thread.title}
          </h2>
          <p className="text-sm text-gray-700 line-clamp-3">
            {thread.description}
          </p>

          <div className="flex items-center text-xs text-gray-500 mt-2">
            <div className="flex items-center justify-center bg-gray-200 rounded-full px-3 py-1.5">
              <FaRegCommentAlt className="text-lg mr-1.5 text-gray-700" />
              <span className="text-sm font-semibold text-gray-700">
                {thread.commentCount}
              </span>
            </div>
            {/* Show lock icon if thread is locked */}
            {thread.locked && (
              <FaLock className="ml-2 text-red-600" title="Thread is locked" />
            )}
          </div>

          {/* Show locked notice inside the thread, but still clickable */}
          {thread.locked && (
            <p className="text-sm text-red-600 mt-2">
              This thread is locked. No further interaction allowed.
            </p>
          )}
        </Link>
      ) : (
        <div
          className="block bg-white border border-gray-300 p-4 rounded-lg shadow-sm relative group"
          title="Log in to view thread"
        >
          <p className="text-xs font-bold text-gray-600 mb-1">
            r/{thread.category}
          </p>

          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span>u/Username</span>
            <span className="mx-1">•</span>
            <span>
              {formatDistanceToNow(new Date(thread.creationDate))} ago
            </span>
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            {thread.title}
          </h2>
          <p className="text-sm text-gray-700 line-clamp-3">
            {thread.description}
          </p>

          <div className="flex items-center text-xs text-gray-500 mt-2">
            <div className="flex items-center justify-center bg-gray-200 rounded-full px-3 py-1.5">
              <FaRegCommentAlt className="text-lg mr-1.5 text-gray-700" />
              <span className="text-sm font-semibold text-gray-700">
                {thread.commentCount}
              </span>
            </div>
          </div>

          {/* Hover overlay for non-logged-in users */}
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
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
