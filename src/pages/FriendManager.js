import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import "./FriendManager.css";

import API_BASE from "../ApiBase";

const FriendManager = () => {
    const { user } = useContext(UserContext);
    const [allUsers, setAllUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [usersRes, friendsRes, pendingRes, sentRes] = await Promise.all([
                fetch(`${API_BASE}/auth/users`).then(res => res.json()),
                fetch(`${API_BASE}/friends/list/${user.userid}`).then(res => res.json()),
                fetch(`${API_BASE}/friends/pending/${user.userid}`).then(res => res.json()),
                fetch(`${API_BASE}/friends/sent/${user.userid}`).then(res => res.json()),
            ]);

            setAllUsers(usersRes.filter(u => u.userid !== user.userid));
            setFriends(friendsRes);
            setPendingRequests(pendingRes);
            setSentRequests(sentRes);
        } catch (err) {
            console.error("Failed to load friend data", err);
        }
    };

    const getFriendStatus = (otherUserId) => {
        if (friends.some(f => f.userid === otherUserId)) return "Friend";
        if (pendingRequests.some(p => p.userid === otherUserId)) return "Pending";
        if (sentRequests.some(s => s.userid === otherUserId)) return "Request Sent";
        return "Add";
    };

    const handleAction = async (endpoint, friendId) => {
        await fetch(`${API_BASE}/friends/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.userid, friendId }),
        });
        fetchData();
    };

    const filteredUsers = allUsers
        .filter(u => u.username.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5);

    return (
        <div className="friend-manager">
            <h2 className="title">Friend Manager</h2>

            <div className="section">
                <h3 className="section-title">Your Friends</h3>
                <div className="user-list">
                    {friends.map((f) => (
                        <div key={f.userid} className="user-card">
                            <img
                                src={f.profilePicture || "/default-profile.png"}
                                alt="pfp"
                                className="pfp"
                            />
                            <div className="user-info">
                                <span className="username">{f.username}</span>
                                <span className="status">Friend</span>
                            </div>
                            <div className="action-buttons">
                                <button onClick={() => handleAction("delete", f.userid)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <h3 className="section-title">Add Friends</h3>
                <input
                    className="search-input"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="user-list">
                    {filteredUsers.map((u) => {
                        const status = getFriendStatus(u.userid);
                        return (
                            <div key={u.userid} className="user-card">
                                <img
                                    src={u.profilePicture || "/default-profile.png"}
                                    alt="pfp"
                                    className="pfp"
                                />
                                <div className="user-info">
                                    <span className="username">{u.username}</span>
                                    <span className="status">{status}</span>
                                </div>
                                <div className="action-buttons">
                                    {status === "Add" && (
                                        <button onClick={() => handleAction("request", u.userid)}>Add</button>
                                    )}
                                    {status === "Pending" && (
                                        <>
                                            <button onClick={() => handleAction("accept", u.userid)}>Accept</button>
                                            <button onClick={() => handleAction("decline", u.userid)}>Decline</button>
                                        </>
                                    )}
                                    {status === "Friend" && (
                                        <button onClick={() => handleAction("delete", u.userid)}>Remove</button>
                                    )}
                                    {status === "Request Sent" && (
                                        <span className="request-sent">Request Sent</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FriendManager;
