import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        if (storedUserId) {
            setUser({ id: storedUserId });
        }
    }, []);

    const login = (userId) => {
        sessionStorage.setItem("userId", userId);
        setUser({ id: userId });
    };

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
