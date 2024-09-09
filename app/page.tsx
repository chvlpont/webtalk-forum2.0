"use client";

import React, { useEffect, useState } from "react";
import ThreadCard from "@/components/threadCard";
import { useSearch } from "../context/searchContext";
import { getThreadsFromLocalStorage } from "../utils/localStorage";
import Link from "next/link";

const Home: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const storedThreads = getThreadsFromLocalStorage();
    setThreads(storedThreads);
    setFilteredThreads(storedThreads); // Initialize filtered threads

    // Check if the user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    // Filter threads based on search query
    const filtered = threads.filter((thread) => {
      const titleMatch = thread.title
        ? thread.title.toLowerCase().includes(searchQuery.toLowerCase())
        : false;
      const descriptionMatch = thread.description
        ? thread.description.toLowerCase().includes(searchQuery.toLowerCase())
        : false;
      const tagsMatch = thread.tags
        ? thread.tags.some((tag) =>
            tag.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : false;

      return titleMatch || descriptionMatch || tagsMatch;
    });

    setFilteredThreads(filtered);
  }, [searchQuery, threads]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {isLoggedIn && (
        <Link
          href="/create-thread"
          className="inline-block mb-4 text-white bg-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create a New Thread
        </Link>
      )}

      <ul className="space-y-4">
        {filteredThreads
          .sort(
            (a, b) =>
              new Date(b.creationDate).getTime() -
              new Date(a.creationDate).getTime()
          )
          .map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              isLoggedIn={isLoggedIn}
            />
          ))}
      </ul>
    </div>
  );
};

export default Home;
