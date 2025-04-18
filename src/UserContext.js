// UserContext.js
import React, { createContext, useState, useEffect } from "react";
import API_BASE from "./ApiBase";
import {useNavigate} from "react-router-dom";
export const UserContext = createContext();



export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const storedUserId = sessionStorage.getItem("userId");
            if (storedUserId) {
                try {
                    const res = await fetch(`${API_BASE}/auth/users/${storedUserId}`);
                    const data = await res.json();
                    setUser(data);
                } catch (err) {
                    console.error("Failed to load user:", err);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    const login = (userData) => {
        sessionStorage.setItem("userId", userData.userid);
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
        navigate("/");
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};
