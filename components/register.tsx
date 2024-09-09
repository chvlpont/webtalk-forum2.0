import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Login from "./login"; // Import the Login component

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State for login modal

  const handleRegister = () => {
    if (username && password) {
      localStorage.setItem("user", JSON.stringify({ username, password }));
      console.log("User registered");
      setError("");
      toast.success("Successfully registered!");
    } else {
      console.log("Failed to register");
      setError("Please fill out all fields.");
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <Toaster />
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

      {/* Add Login link/button */}
      <p className="text-center mt-4">
        Already have an account?{" "}
        <button className="text-blue-500 underline" onClick={openLoginModal}>
          Log in
        </button>
      </p>

      {/* Conditionally render the login modal */}
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
            <Login /> {/* Render the login component */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
