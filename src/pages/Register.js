import React, { useState } from "react";
import "./reglogin.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const API_BASE = "https://shonenscroll-backend.onrender.com";

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
            // Sending POST request to register API
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            // If the response is not successful, show an error
            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Show success message if registration is successful
            setSuccess("User registered successfully!");
        } catch (err) {
            // Catch and display the error
            setError(err.message);
        }
    };

    return (
        <div className="Container">
            <h2>Register</h2>
            <br />
            {/* Display error or success messages */}
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            {/* Username input field */}
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

            {/* Email input field */}
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

            {/* Password input field */}
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

            {/* Register button */}
            <Button variant="contained" color="success" sx={{ ml: 30 }} onClick={handleRegister}>
                Register
            </Button>
        </div>
    );
}
