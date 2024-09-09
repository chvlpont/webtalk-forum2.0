import React, { useState, useEffect } from "react";
import { lockThread, unlockThread, deleteThread } from "../utils/localStorage";
import { FaLock, FaUnlock, FaEllipsisV, FaTrash } from "react-icons/fa";

type ThreadDetailHeaderProps = {
  thread: Thread; // Now expecting a full thread object
  onCommentIconClick: () => void;
};

const ThreadDetailHeader: React.FC<ThreadDetailHeaderProps> = ({ thread }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isLocked, setIsLocked] = useState(thread.locked || false); // Initialize with thread.locked
  const [showMenu, setShowMenu] = useState(false); // State to handle dropdown visibility

  useEffect(() => {
    // Check if the user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username: savedUsername } = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUsername(savedUsername);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLock = () => {
    lockThread(thread.id);
    setIsLocked(true);
    console.log(`Thread ${thread.id} locked`);
    window.location.reload();
  };

  const handleUnlock = () => {
    unlockThread(thread.id);
    setIsLocked(false);
    console.log(`Thread ${thread.id} unlocked`);
    window.location.reload();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this thread?")) {
      deleteThread(thread.id);
      console.log(`Thread ${thread.id} deleted`);
      window.location.href = "/"; // Redirect to home or another appropriate page
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="thread-detail-header bg-white p-4 rounded-lg shadow-sm relative">
      {/* Three dots menu positioned in the top right */}
      {isLoggedIn && (
        <div className="absolute top-2 right-2 my-3">
          <button
            className="text-gray-600 focus:outline-none"
            onClick={toggleMenu}
          >
            <FaEllipsisV size={20} />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
              <ul className="py-2">
                {isLocked ? (
                  <li
                    onClick={handleUnlock}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-black"
                  >
                    <FaUnlock className="mr-2" /> Unlock Thread
                  </li>
                ) : (
                  <li
                    onClick={handleLock}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-black"
                  >
                    <FaLock className="mr-2" /> Lock Thread
                  </li>
                )}
                <li
                  onClick={handleDelete}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-red-600"
                >
                  <FaTrash className="mr-2" /> Delete Thread
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      <h1 className="text-2xl font-semibold text-black">{thread.title}</h1>
      <p className="text-black mb-2">{thread.description}</p>
      <p className="text-gray-600">
        Posted in r/{thread.category} by{" "}
        {username ? `u/${username}` : "Anonymous"}
      </p>

      {/* Display message if the thread is locked */}
      {isLocked && (
        <p className="mt-2 text-red-600">
          This thread is locked. No further interactions are allowed.
        </p>
      )}
    </div>
  );
};

export default ThreadDetailHeader;
