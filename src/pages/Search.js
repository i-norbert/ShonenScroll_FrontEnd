import React, { useState, useEffect, useContext } from "react";
import "./Search.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import API_BASE from "../ApiBase";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function Search() {
    const { user } = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [authorQuery, setAuthorQuery] = useState("");
    const [sortOption, setSortOption] = useState("titleAsc");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) return;
            try {
                const res = await fetch(`${API_BASE}/manga/user/${user.userid}`);
                const data = await res.json();
                setFavorites(data.map(m => m.id));
            } catch (err) {
                console.error("Failed to fetch liked mangas:", err);
            }
        };
        fetchFavorites();
    }, [user]);

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

    const handleLikeToggle = async (mangaId, isLiked) => {
        if (!user) {
            alert("Please log in to like mangas.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/manga/${isLiked ? "unlike" : "like"}`, {
                method: isLiked ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.userid, mangaId }),
            });

            if (!response.ok) throw new Error("Failed to update like");

            setFavorites((prev) =>
                isLiked ? prev.filter(id => id !== mangaId) : [...prev, mangaId]
            );
        } catch (err) {
            console.error("Like update failed:", err);
        }
    };

    const isLikedByUser = (mangaId) => user && favorites.includes(mangaId);

    return (
        <div className="search-container">
            <h2 className="search-header">Search for Manga</h2>

            <div className="search-filters">
                <TextField
                    className="textfield"
                    label="Search by Title"
                    variant="standard"
                    color="secondary"
                    sx={{ input: { color: "white" ,backgroundColor:"rgba(0,0,0,0)",boxShadow: "none",marginBottom:"20px"} }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                />
                <TextField
                    className="textfield"
                    label="Search by Author"
                    variant="standard"
                    color="secondary"
                    sx={{ input: { color: "white" ,backgroundColor:"rgba(0,0,0,0)",boxShadow: "none",marginBottom:"20px"} }}
                    value={authorQuery}
                    onChange={(e) => setAuthorQuery(e.target.value)}
                    fullWidth
                />
                <TextField
                    className="textfield"
                    select
                    label="Sort By"
                    variant="standard"
                    color="secondary"
                    value={sortOption}
                    sx={{ minWidth: 150 }}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <MenuItem value="titleAsc">Title A-Z</MenuItem>
                    <MenuItem value="titleDesc">Title Z-A</MenuItem>
                    <MenuItem value="newest">Newest Uploads</MenuItem>
                    <MenuItem value="oldest">Oldest Uploads</MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2, width: '100%' }}
                    onClick={() => handleSearch(1)}
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </Button>
            </div>

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
                                <p className="manga-author">Author: {manga.author}</p>
                                <div
                                    className={`favorite-icon-button ${isLikedByUser(manga.id) ? "favorited" : ""}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleLikeToggle(manga.id, isLikedByUser(manga.id));
                                    }}
                                >
                                    <i className="fas fa-heart" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <Button
                        variant="outlined"
                        onClick={() => handleSearch(page - 1)}
                        disabled={page === 1}
                    >
                        Prev
                    </Button>
                    <span>Page {page} of {totalPages}</span>
                    <Button
                        variant="outlined"
                        onClick={() => handleSearch(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
