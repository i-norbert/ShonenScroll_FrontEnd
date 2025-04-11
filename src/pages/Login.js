import React, { useContext, useState } from "react";
import "./reglogin.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import API_BASE from '../ApiBase';
import { UserContext } from "../UserContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { login } = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Login failed");

            // Store user ID only, let UserProvider fetch full user object
            sessionStorage.setItem("userId", data.user.userid);
            login(data.user);
            setSuccess("Login successful!");

            // Navigate after short delay (optional but can help timing)
            setTimeout(() => {
                navigate("/");
            }, 100);

        } catch (err) {
            setError(err.message);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleLogin(); // Trigger the login if Enter is pressed
        }
    };

    return (
        <div className="Container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <TextField
                className="textfield"
                label="Email"
                variant="standard"
                color="secondary"
                sx={{ input: { color: "white" } }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress} // Listen for the Enter key
            />
            <br />
            <TextField
                className="textfield"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="standard"
                color="secondary"
                sx={{ input: { color: "white" } }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress} // Listen for the Enter key
            />
            <br />
            <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={handleLogin}
            >
                Login
            </Button>
        </div>
    );
}
