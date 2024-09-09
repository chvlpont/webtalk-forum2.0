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
      className="px-4 py-4 flex justify-between items-center w-full"
      style={{ boxShadow: "0px 1px 0px rgba(229, 231, 235, 0.5)" }}
    >
      <div className="flex-1">
        <Link href="/">
          <div className="cursor-pointer">
            <Image
              src="/räddit.png"
              alt="Räddit Logo"
              width={100}
              height={40}
            />
          </div>
        </Link>
      </div>
      <div className="flex-1 text-center">
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
              className="bg-gray-500 text-white rounded-full hover:opacity-70 px-4 py-2 text-sm mr-2"
              onClick={openLoginModal}
            >
              Log in
            </button>
            <button
              className="bg-gray-500 text-white rounded-full hover:opacity-70 px-4 py-2 text-sm"
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
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeLoginModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 relative max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeLoginModal}
            >
              ×
            </button>
            <Login />
          </div>
        </div>
      )}
      {isRegisterModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeRegisterModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 relative max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeRegisterModal}
            >
              ×
            </button>
            <Register />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
