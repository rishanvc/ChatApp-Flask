import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import ChatLayout from "./components/ChatLayout";

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("chatUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("chatUser");
    setUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("chatUser", JSON.stringify(userData));
  };

  if (user) {
    return <ChatLayout user={user} onLogout={handleLogout} />;
  }

  return (
    <div>
      {showLogin ? (
  <Login
    onLoginSuccess={handleLoginSuccess}
    onSwitchToRegister={() => setShowLogin(false)}
  />
) : (
  <Register onSwitchToLogin={() => setShowLogin(true)} />
)}

   
    </div>
  );
}

export default App;
