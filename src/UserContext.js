// UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const API_BASE = "http://localhost:5000/auth";

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        if (storedUserId) {
            fetch(`${API_BASE}/users/${storedUserId}`)
                .then(res => res.json())
                .then(data => {
                    setUser(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load user:", err);
                    setUser(null);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        sessionStorage.setItem("userId", userData.id);
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};
