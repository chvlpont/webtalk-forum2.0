import React, { useState } from "react";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (username && password) {
      localStorage.setItem("user", JSON.stringify({ username, password }));
      console.log("User registered");
      setError("");
    } else {
      console.log("Failed to register");
      setError("Please fill out all fields.");
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
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
};

export default Register;
