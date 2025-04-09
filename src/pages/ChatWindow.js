// ChatWindow.js
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import "./ChatWindow.css";
import API_BASE_URL from "../ApiBase";

const ChatWindow = () => {
    const { id: friendId } = useParams();
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [friend, setFriend] = useState(null);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        fetch(`${API_BASE_URL}/messages/conversation/${user.userid}/${friendId}`)
            .then(res => res.json())
            .then(setMessages);

        fetch(`${API_BASE_URL}/auth/users/${friendId}`)
            .then(res => res.json())
            .then(setFriend);
    }, [user, friendId]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const res = await fetch(`${API_BASE_URL}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                senderId: user.userid,
                receiverId: parseInt(friendId),
                content: newMessage,
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

    const renderMessageContent = (msg) => {
        try {
            const parsed = JSON.parse(msg.content);
            if (parsed.type === "chapter") {
                return (
                    <div className="chapter-card">
                        <img
                            src={`${API_BASE_URL}${parsed.thumbnail}`}
                            alt={parsed.title}
                            className="chapter-thumb"
                            onClick={() => setEnlargedImage(`${API_BASE_URL}${parsed.thumbnail}`)}
                        />
                        <div className="chapter-info">
                            <div className="chapter-title">{parsed.title}</div>
                            <Link
                                to={`/reading/${parsed.mangaId}`}
                                className="chapter-link"
                            >
                                Read Chapter {parsed.chapterNumber}
                            </Link>
                        </div>
                    </div>
                );
            }
        } catch (err) {
            // Not JSON, render as plain text
        }
        return <div className="message-content">{msg.content}</div>;
    };

    if (!user || !friend) return <div className="chat-window">Loading chat...</div>;

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
                            {!isSent && <img src={sender.profilePicture} alt="pfp" className="message-pfp" />}
                            <div className="message-bubble">
                                {renderMessageContent(msg)}
                                <div className="message-time">
                                    {new Date(msg.timestamp).toLocaleString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </div>
                            </div>
                            {isSent && <img src={sender.profilePicture} alt="pfp" className="message-pfp" />}
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

            {enlargedImage && (
                <div className="enlarged-image-modal" onClick={() => setEnlargedImage(null)}>
                    <img src={enlargedImage} alt="Enlarged" className="enlarged-image" />
                    <span className="close-button" onClick={() => setEnlargedImage(null)}>×</span>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
