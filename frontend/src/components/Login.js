import { useState } from "react";

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (data.status === "success") {
      onLoginSuccess(data);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-gray-200">

      <div className="bg-white w-96 rounded-2xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Welcome Back 👋
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full border rounded-lg px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg px-4 py-2 mb-5 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
        />

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-200 shadow-md"
          onClick={handleLogin}
        >
          Login
        </button>

        {message && (
          <p className="mt-3 text-sm text-center text-gray-600">
            {message}
          </p>
        )}

        {/* Register Section */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-500 font-medium hover:underline"
          >
            Register
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;