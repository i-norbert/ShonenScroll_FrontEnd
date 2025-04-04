import React, { useState, useContext } from "react";
import "./reglogin.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {UserContext} from "../UserContext";

const API_BASE = "https://shonenscroll-backend.onrender.com";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { login } = useContext(UserContext); // ← use context
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

            login(data.userId); // ← set user in context

            setSuccess("Login successful!");
            setTimeout(() => navigate("/", { replace: true }), 1000);
        } catch (err) {
            setError(err.message);
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
            />
            <br />
            <Button variant="contained" color="success" sx={{ ml: 30 }} onClick={handleLogin}>
                Login
            </Button>
        </div>
    );
}
