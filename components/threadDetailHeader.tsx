import React, { useState, useEffect } from "react";
import { lockThread, unlockThread, deleteThread } from "../utils/localStorage";
import { FaLock, FaUnlock, FaEllipsisV, FaTrash } from "react-icons/fa";

type ThreadDetailHeaderProps = {
  thread: Thread;
  onCommentIconClick: () => void;
};

const ThreadDetailHeader: React.FC<ThreadDetailHeaderProps> = ({ thread }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isLocked, setIsLocked] = useState(thread.locked || false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
    deleteThread(thread.id);
    console.log(`Thread ${thread.id} deleted`);
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="thread-detail-header bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-600 shadow-lg relative text-white">
      {/* Three dots menu */}
      {isLoggedIn && (
        <div className="absolute top-2 right-2 my-3">
          <button
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
            onClick={toggleMenu}
          >
            <FaEllipsisV size={20} />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 bg-opacity-90 border border-gray-600 rounded shadow-lg">
              <ul className="py-2">
                {thread.category === "QNA" && (
                  <>
                    {isLocked ? (
                      <li
                        onClick={handleUnlock}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center text-gray-300"
                      >
                        <FaUnlock className="mr-2" /> Unlock QNA
                      </li>
                    ) : (
                      <li
                        onClick={handleLock}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center text-gray-300"
                      >
                        <FaLock className="mr-2" /> Lock QNA
                      </li>
                    )}
                    <li
                      onClick={confirmDelete}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center text-red-500"
                    >
                      <FaTrash className="mr-2" /> Delete QNA
                    </li>
                  </>
                )}
                {thread.category === "THREAD" && (
                  <>
                    {isLocked ? (
                      <li
                        onClick={handleUnlock}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center text-gray-300"
                      >
                        <FaUnlock className="mr-2" /> Unlock Thread
                      </li>
                    ) : (
                      <li
                        onClick={handleLock}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center text-gray-300"
                      >
                        <FaLock className="mr-2" /> Lock Thread
                      </li>
                    )}
                    <li
                      onClick={confirmDelete}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center text-red-500"
                    >
                      <FaTrash className="mr-2" /> Delete Thread
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      <h1 className="text-2xl font-semibold text-white">{thread.title}</h1>
      <p className="text-gray-300 mb-2">{thread.description}</p>
      <p className="text-gray-400">
        Posted in <span className="text-gray-300">r/{thread.category}</span> by{" "}
        {username ? `u/${username}` : "Anonymous"}
      </p>

      {/* Display message if the thread is locked */}
      {isLocked && (
        <div className="mt-2 p-2 bg-gray-800 rounded text-red-500">
          This thread is locked. No further interactions are allowed.
        </div>
      )}

      {/* Delete confirmation dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 shadow-lg">
            <p className="mb-4 text-center">
              Are you sure you want to delete this{" "}
              {thread.category === "QNA" ? "QNA" : "Thread"}?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 text-white"
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
              <button
                className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500 text-white"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadDetailHeader;
