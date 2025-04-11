import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Favorites.css";
import { UserContext } from "../UserContext";
import API_BASE from '../ApiBase';

export default function Favorites() {
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchMangas = async () => {
            try {
                const response = await fetch(`${API_BASE}/manga/user/${user.userid}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch mangas.");
                }
                const data = await response.json();
                setMangas(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMangas();
    }, [user]);

    // Function to handle removing a manga from the favorites
    const handleRemoveFavorite = async (mangaId) => {
        try {
            const response = await fetch(`${API_BASE}/manga/unlike`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.userid, mangaId }),
            });

            if (!response.ok) throw new Error("Failed to remove from favorites.");

            // Remove the manga from state after successfully deleting it
            setMangas((prevMangas) => prevMangas.filter((manga) => manga.id !== mangaId));
        } catch (err) {
            console.error("Error removing from favorites:", err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="manga-page">
            <h2>Favorites</h2>
            <div className="manga-list">
                {mangas.map((manga) => (
                    <div key={manga.id} className="manga-item">
                        <Link to={`/reading/${manga.id}`} className="manga-item-link">
                            <img
                                src={API_BASE + manga.coverImage}
                                alt={manga.title}
                                className="manga-cover"
                            />
                            <div className="manga-details">
                                <h3>{manga.title}</h3>
                                <p>Author: {manga.author}</p>
                            </div>
                        </Link>
                        {/* Add remove button */}
                        <button
                            className="remove-favorite-btn"
                            onClick={() => handleRemoveFavorite(manga.id)}
                        >
                            Remove from Favorites
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
