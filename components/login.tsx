"use client";

import React, { useState } from "react";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username: storedUsername, password: storedPassword } =
        JSON.parse(storedUser);
      if (username === storedUsername && password === storedPassword) {
        console.log("Login successful!");
        setError("");
        window.location.reload(); // Page refresh
      } else {
        console.log("Incorrect username or password");
        setError("Incorrect username or password");
      }
    } else {
      console.log("No user found. Please register.");
      setError("No user found. Please register.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 mb-4 border rounded-md text-black"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded-md text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full p-2 bg-blue-500 text-white rounded-md"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
