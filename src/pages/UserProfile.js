import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import "./UserProfile.css";

import API_BASE from '../ApiBase';


const UserProfile = () => {
    const { user, loading, login } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [editing, setEditing] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setProfilePicture(user.profilePicture || "");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Saving...");

        const userId = user?.userid || user?.id;
        if (!userId) {
            console.error("❌ No valid user ID found for update:", user);
            setStatus("❌ Unable to update profile.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/auth/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, profilePicture }),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const { user: updatedUserData } = await response.json();

            // ✅ Update context with new data
            login(updatedUserData);

            setStatus("✅ Profile updated!");
            setEditing(false);
        } catch (err) {
            console.error("Update failed:", err);
            setStatus("❌ Error updating profile.");
        }
    };

    if (loading) return <p className="neon-text">Loading...</p>;
    if (!user) return <p className="neon-text">Please log in to view your profile.</p>;

    return (
        <div className="user-profile neon-panel">
            <h2 className="neon-heading">Your Profile</h2>
            <div className="profile-info">
                <img
                    src={profilePicture || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="profile-picture"
                />
                {editing ? (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <label>
                            <span className="neon-label">Username</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>
                        <label>
                            <span className="neon-label">Profile Picture URL</span>
                            <input
                                type="text"
                                value={profilePicture}
                                onChange={(e) => setProfilePicture(e.target.value)}
                            />
                        </label>
                        <div className="button-group">
                            <button type="submit" className="neon-button">Save</button>
                            <button type="button" className="neon-button danger" onClick={() => setEditing(false)}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <p className="neon-text"><strong>Username:</strong> {user.username}</p>
                        <p className="neon-text"><strong>Email:</strong> {user.email}</p>
                        <button onClick={() => setEditing(true)} className="neon-button">Edit Profile</button>
                    </>
                )}
                {status && <p className="status-text">{status}</p>}
            </div>
        </div>
    );
};

export default UserProfile;
