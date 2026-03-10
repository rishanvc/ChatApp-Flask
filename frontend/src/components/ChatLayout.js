import { useEffect, useState } from "react";

function ChatLayout({ user ,onLogout }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");


  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/users/${user.user_id}`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [user]);


  useEffect(() => {
  if (!selectedUser) return;

  const fetchMessages = () => {
    fetch(`http://127.0.0.1:5000/api/messages/${user.user_id}/${selectedUser.id}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  };

  fetchMessages(); // load immediately

  const interval = setInterval(fetchMessages, 2000); // every 2 seconds

  return () => clearInterval(interval);

}, [selectedUser,user]);



const filteredUsers = users.filter(u =>
  u.username.toLowerCase().includes(search.toLowerCase())
);


  const sendMessage = async () => {
  if (!messageText || !selectedUser) return;

  await fetch("http://127.0.0.1:5000/api/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender_id: user.user_id,
      receiver_id: selectedUser.id,
      content: messageText,
    }),
  });

  setMessageText("");

fetch(`http://127.0.0.1:5000/api/messages/${user.user_id}/${selectedUser.id}`)
  .then(res => res.json())
  .then(data => setMessages(data));
};



  return (
    <div className="flex h-screen">
      {/* LEFT SIDEBAR */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Friends</h2>
            <button
              className="bg-red-500 px-2 py-1 text-sm rounded"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 mb-3 text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className={`p-2 mb-2 rounded cursor-pointer ${
              selectedUser?.id === u.id ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={() => setSelectedUser(u)}
          >
            {u.username}
          </div>
        ))}
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 bg-gray-100 p-4 flex flex-col">

  {selectedUser ? (
    <>
      <h2 className="text-lg font-bold mb-4">
        Chat with {selectedUser.username}
      </h2>

      {/* MESSAGE AREA */}
    <div className="flex-1 border p-4 mb-4 bg-white overflow-y-auto">

  {messages.map((msg, index) => {

    const isMine = msg.sender_id === user.user_id;

    return (
      <div
        key={index}
        className={`flex mb-2 ${
          isMine ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`px-4 py-2 rounded-lg max-w-xs ${
            isMine
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          {msg.content}
        </div>
      </div>
    );
  })}

</div>

      {/* INPUT AREA */}
      <div className="flex">
        <input
          type="text"
          className="flex-1 border p-2"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </>
  ) : (
    <p>Select a user to start chatting</p>
  )}

</div>
    </div>
  );
}

export default ChatLayout;
