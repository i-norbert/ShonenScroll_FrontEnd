import React, { useState, useEffect } from "react";
import "./Search.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import API_BASE from "../ApiBase";
import { Link } from "react-router-dom";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [authorQuery, setAuthorQuery] = useState("");
    const [sortOption, setSortOption] = useState("titleAsc");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleSearch = async (pageNumber = 1) => {
        if (!searchQuery.trim() && !authorQuery.trim()) return;

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE}/manga/search?title=${searchQuery}&author=${authorQuery}&sort=${sortOption}&page=${pageNumber}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch manga results.");
            }

            setSearchResults(data.results);
            setTotalPages(data.totalPages);
            setPage(pageNumber);
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
            <TextField
                className="textfield"
                label="Search by Author"
                variant="standard"
                color="secondary"
                sx={{ input: { color: "white" }, marginLeft: 2 }}
                value={authorQuery}
                onChange={(e) => setAuthorQuery(e.target.value)}
            />
            <TextField
                className="textfield"
                select
                label="Sort By"
                variant="standard"
                color="secondary"
                value={sortOption}
                sx={{ marginLeft: 2, minWidth: 150 }}
                onChange={(e) => setSortOption(e.target.value)}
            >
                <MenuItem value="titleAsc">Title A-Z</MenuItem>
                <MenuItem value="titleDesc">Title Z-A</MenuItem>
                <MenuItem value="newest">Newest Uploads</MenuItem>
                <MenuItem value="oldest">Oldest Uploads</MenuItem>
            </TextField>
            <br />
            <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={() => handleSearch(1)}
                disabled={loading}
            >
                {loading ? "Searching..." : "Search"}
            </Button>

            {error && <p className="error">{error}</p>}

            {searchResults.length === 0 && !loading && (searchQuery || authorQuery) && (
                <p>No results found.</p>
            )}

            {searchResults.length > 0 && (
                <div className="manga-list">
                    {searchResults.map((manga) => (
                        <Link key={manga.id} to={`/reading/${manga.id}`} className="manga-card-link">
                            <div className="manga-card">
                                <img
                                    src={`${API_BASE}${manga.coverImage}`}
                                    alt={manga.title}
                                    className="manga-cover"
                                />
                                <h3 className="manga-title">{manga.title}</h3>
                                <div className="manga-details">
                                    <p>Author: {manga.author}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}


            {totalPages > 1 && (
                <div className="pagination">
                    <Button onClick={() => handleSearch(page - 1)} disabled={page === 1}>
                        Prev
                    </Button>
                    <span>Page {page} of {totalPages}</span>
                    <Button onClick={() => handleSearch(page + 1)} disabled={page === totalPages}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
