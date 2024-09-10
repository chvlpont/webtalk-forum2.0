"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import Login from "./login";
import Register from "./register";
import { useSearch } from "../context/searchContext";

const Header: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username: savedUsername } = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUsername(savedUsername);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    window.location.reload();
    console.log("Logged out");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    console.log(setSearchQuery);
  };

  return (
    <header
      className="px-[10%] py-4 flex justify-between items-center w-full"
      style={{ boxShadow: "0px 1px 0px rgba(229, 231, 235, 0.5)" }}
    >
      <div className="flex-1 flex items-center justify-start">
        <Link href="/">
          <span className="text-2xl font-bold text-white">WEBTALK</span>
        </Link>
      </div>
      <div className="flex-1">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="border rounded-full pl-10 pr-3 py-2 w-full text-sm text-white bg-gray-800"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="flex-1 text-right">
        {!isLoggedIn ? (
          <>
            <button
              className="bg-gray-700 text-gray-200 rounded-full hover:bg-gray-600 px-4 py-2 text-sm mr-2 transition"
              onClick={openLoginModal}
            >
              Log in
            </button>
            <button
              className="bg-gray-700 text-gray-200 rounded-full hover:bg-gray-600 px-4 py-2 text-sm transition"
              onClick={openRegisterModal}
            >
              Register
            </button>
          </>
        ) : (
          <div className="flex items-center space-x-4 justify-end">
            <p className="text-white text-sm">Hi, {username}!</p>
            <button
              className="bg-gray-600 text-white rounded-full hover:bg-gray-700 px-4 py-2 text-sm"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeLoginModal}
        >
          <div
            className="bg-gray-900 text-white rounded-lg shadow-lg p-6 relative max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
              onClick={closeLoginModal}
            >
              ×
            </button>
            <Login
              closeLoginModal={closeLoginModal} // Pass the function to close the modal
              openRegisterModal={openRegisterModal} // Pass the function to open the register modal
            />
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeRegisterModal}
        >
          <div
            className="bg-gray-900 text-white rounded-lg shadow-lg p-6 relative max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
              onClick={closeRegisterModal}
            >
              ×
            </button>
            <Register
              closeRegisterModal={closeRegisterModal}
              openLoginModal={openLoginModal}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
