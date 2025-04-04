import React, { useState, useEffect } from "react";
import "./Search.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const API_BASE = "https://shonenscroll-backend.onrender.com";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch manga data when search query is updated
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/manga/search?title=${searchQuery}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch manga results.");
            }

            setSearchResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <h2>Search for Manga</h2>
            <br />
            <TextField
                className="textfield"
                label="Search by Title"
                variant="standard"
                color="secondary"
                sx={{ input: { color: "white" } }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <br />
            <Button
                variant="contained"
                color="success"
                sx={{ ml: 30 }}
                onClick={handleSearch}
                disabled={loading}
            >
                {loading ? "Searching..." : "Search"}
            </Button>

            {error && <p className="error">{error}</p>}

            {searchResults.length === 0 && !loading && searchQuery.trim() && (
                <p>No results found.</p>
            )}

            {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((manga) => (
                        <div key={manga.id} className="manga-item">
                            <img
                                src={`${API_BASE}${manga.coverImage}`}
                                alt={manga.title}
                                className="manga-cover"
                            />
                            <div className="manga-details">
                                <h3>{manga.title}</h3>
                                <p>Author: {manga.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
