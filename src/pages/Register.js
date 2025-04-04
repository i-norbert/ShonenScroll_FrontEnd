import React, { useState } from "react";
import "./reglogin.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const API_BASE = "http://localhost:5000";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async () => {
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            setSuccess("User registered successfully!");
            setUsername("");
            setEmail("");
            setPassword("");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="Container">
            <h2>Register</h2>
            <br />
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <TextField
                className="textfield"
                label="Username"
                variant="standard"
                color="secondary"
                sx={{ input: { color: "white" } }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
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
            <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={handleRegister}
            >
                Register
            </Button>
        </div>
    );
}
