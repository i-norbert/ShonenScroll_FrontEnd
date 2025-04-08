import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import "./ChatWindow.css";

const ChatWindow = () => {
    const { id: friendId } = useParams();
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [friend, setFriend] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        fetch(`http://localhost:5000/messages/conversation/${user.userid}/${friendId}`)
            .then(res => res.json())
            .then(setMessages);

        fetch(`http://localhost:5000/auth/users/${friendId}`)
            .then(res => res.json())
            .then(setFriend);
    }, [user, friendId]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const res = await fetch("http://localhost:5000/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                senderId: user.userid,
                receiverId: parseInt(friendId),
                content: newMessage
            }),
        });

        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        setNewMessage("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const getSenderData = (msg) => {
        return msg.senderId === user.userid ? user : friend;
    };

    if (!user || !friend) {
        return <div className="chat-window">Loading chat...</div>;
    }

    return (
        <div className="chat-window">
            <div className="chat-header-bar">
                <img src={friend.profilePicture} alt="friend" className="chat-header-pfp" />
                <h3>{friend.username}</h3>
            </div>

            <div className="chat-messages">
                {messages.map((msg) => {
                    const sender = getSenderData(msg);
                    const isSent = msg.senderId === user.userid;

                    return (
                        <div key={msg.messageid} className={`message-row ${isSent ? "sent" : "received"}`}>
                            {!isSent && (
                                <img src={sender.profilePicture} alt="pfp" className="message-pfp" />
                            )}
                            <div className="message-bubble">
                                <div className="message-content">{msg.content}</div>
                                <div className="message-time">
                                    {new Date(msg.timestamp).toLocaleString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}
                                </div>
                            </div>
                            {isSent && (
                                <img src={sender.profilePicture} alt="pfp" className="message-pfp" />
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="message-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
};

export default ChatWindow;
