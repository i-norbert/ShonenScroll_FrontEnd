import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "./ChatPage.css";

const ChatPage = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [chats, setChats] = useState([]);
    const [friends, setFriends] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/messages/chats/${user.userid}`)
            .then(res => res.json())
            .then(setChats);

        fetch(`http://localhost:5000/friends/list/${user.userid}`)
            .then(res => res.json())
            .then(setFriends);
    }, [id, user.userid]);

    const startChat = async (friendId) => {
        try {
            await fetch("http://localhost:5000/messages/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: user.userid,
                    receiverId: friendId,
                }),
            });

            navigate(`/chat/${friendId}`);
        } catch (err) {
            console.error("Error starting chat:", err);
        }
    };

    return (
        <div className="chat-inbox-container">
            <div className="chat-header">
                <h2>Your Messages</h2>
                <button
                    className="new-message-btn"
                    onClick={() => setShowDropdown(!showDropdown)}
                    title="New Message"
                >
                    ＋
                </button>
                {showDropdown && (
                    <div className="friends-dropdown">
                        {friends.map(friend => (
                            <div
                                key={friend.userid}
                                className="dropdown-item"
                                onClick={() => startChat(friend.userid)}
                            >
                                <img src={friend.profilePicture} alt="" />
                                {friend.username}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {chats.length === 0 ? (
                <p>No messages yet!</p>
            ) : (
                <ul className="chat-list">
                    {chats.map((chat, index) => (
                        <li key={index} className="chat-list-item">
                            <Link to={`/chat/${chat.user.userid}`}>
                                <img
                                    src={chat.user.profilePicture}
                                    alt="profile"
                                    className="chat-profile-pic"
                                />
                                <div className="chat-info">
                                    <span className="chat-username">{chat.user.username}</span>
                                    <span className="chat-last-message">
                        {chat.lastMessage.content.trim().startsWith("{") ? "Attachment" : chat.lastMessage.content}
                    </span>
                                </div>
                                <span className="chat-time">
                    {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ChatPage;
