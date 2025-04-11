import React, { useState } from "react";
import "./reglogin.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import API_BASE from '../ApiBase';

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

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleRegister(); // Trigger the registration if Enter is pressed
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
                onKeyPress={handleKeyPress} // Listen for the Enter key
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
                onClick={handleRegister}
            >
                Register
            </Button>
        </div>
    );
}
