import React, { useState } from "react";

interface LoginProps {
  closeLoginModal: () => void;
  openRegisterModal: () => void;
}

const Login: React.FC<LoginProps> = ({
  closeLoginModal,
  openRegisterModal,
}) => {
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
        setError("Incorrect username or password");
      }
    } else {
      setError("No user found. Please register.");
    }
  };

  const handleRegisterClick = () => {
    closeLoginModal(); // Close the login modal
    openRegisterModal(); // Open the register modal
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 mb-4 bg-gray-700 border border-transparent rounded-md placeholder-gray-500 text-gray-200 focus:ring-2 focus:ring-blue-500"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 bg-gray-700 border border-transparent rounded-md placeholder-gray-500 text-gray-200 focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={handleLogin}
      >
        Login
      </button>

      <div className="mt-4 text-center">
        <p className="text-gray-400">Don't have an account?</p>
        <button
          className="text-blue-400 underline hover:text-blue-500"
          onClick={handleRegisterClick}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
