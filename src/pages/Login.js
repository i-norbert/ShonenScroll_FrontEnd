import React, {useEffect, useState} from "react";
import "./reglogin.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

const API_BASE = "https://shonenscroll-backend.onrender.com";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loggedIn, setLoggedIn] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {},[loggedIn])
    //TODO:
    // NEM GÁNY MEGOLDÁST HASZNÁLNI
    const handleLogin = async () => {
        setError("");
        setSuccess("");
        try {
            // Sending POST request to login API
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // Check if response is not okay
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Save token and userId to sessionStorage
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("userId", data.userId);
            setLoggedIn(true)
            

            // Display success message
            setSuccess("Login successful!");

            setTimeout(() => { navigate("/", { replace: true });window.location.reload() }, 1000);

        } catch (err) {
            // Handle error and display the error message
            setError(err.message);
        }
    };

    return (
        <div className="Container">
            <h2>Login</h2>
            <br />
            {/* Display error or success messages */}
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

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

            {/* Login button */}
            <Button variant="contained" color="success" sx={{ ml: 30 }} onClick={handleLogin}>
                Login
            </Button>
        </div>
    );
}
