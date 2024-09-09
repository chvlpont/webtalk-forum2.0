import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface RegisterProps {
  closeRegisterModal: () => void;
  openLoginModal: () => void;
}

const Register: React.FC<RegisterProps> = ({
  closeRegisterModal,
  openLoginModal,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

  const handleLoginClick = () => {
    closeRegisterModal(); // Close register modal
    openLoginModal(); // Open login modal
  };

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

      {/* Add a line break and center the login option */}
      <div className="mt-4 text-center">
        <p className="text-black">Already have an account?</p>
        <button className="text-blue-500 underline" onClick={handleLoginClick}>
          Log in
        </button>
      </div>
    </div>
  );
};

export default Register;
