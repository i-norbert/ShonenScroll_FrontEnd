import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import API_BASE from "../ApiBase";
import "./Home.css";

const Home = () => {
    const { user } = useContext(UserContext);
    const [mangas, setMangas] = useState([]);
    const [newestMangas, setNewestMangas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const shuffleArray = (array) => {
        let shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    useEffect(() => {
        const fetchMangas = async () => {
            try {
                const [mangaRes, favoritesRes] = await Promise.all([
                    fetch(`${API_BASE}/manga/`),
                    user ? fetch(`${API_BASE}/manga/user/${user.userid}`) : Promise.resolve({ ok: true, json: () => [] }),
                ]);

                if (!mangaRes.ok) throw new Error("Failed to fetch mangas");

                const mangaData = await mangaRes.json();
                const favoritesData = user ? await favoritesRes.json() : [];

                const mangasWithLikes = mangaData.map((m) => ({
                    ...m,
                    LikedUsers: favoritesData.some((f) => f.id === m.id)
                        ? [{ userid: user.userid }]
                        : [],
                }));

                const shuffled = shuffleArray(mangasWithLikes);
                const sortedNewest = [...mangasWithLikes].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setNewestMangas(sortedNewest.slice(0, 10));
                setMangas(shuffled.slice(0, 12));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMangas();
    }, [user]);

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

            setMangas((prev) =>
                prev.map((manga) =>
                    manga.id === mangaId
                        ? {
                            ...manga,
                            likes: isLiked ? manga.likes - 1 : manga.likes + 1,
                            LikedUsers: isLiked
                                ? manga.LikedUsers.filter((u) => u.userid !== user.userid)
                                : [...(manga.LikedUsers || []), { userid: user.userid }],
                        }
                        : manga
                )
            );
        } catch (err) {
            console.error("Like update failed:", err);
        }
    };

    const isLikedByUser = (manga) =>
        user && manga.LikedUsers?.some((u) => u.userid === user.userid);

    if (loading) return <div className="loading">Loading random mangas...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="home-container">
            <div className="carousel-banner">
                <div className="carousel-track">
                    {[...newestMangas, ...newestMangas].map((manga, index) => (
                        <Link
                            key={`${manga.id}-${index}`}
                            to={`/reading/${manga.id}`}
                            className="carousel-item"
                        >
                            <img
                                src={`${API_BASE}${manga.coverImage}`}
                                alt={manga.title}
                                className="carousel-image"
                            />
                            <span className="carousel-title">{manga.title}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <h1 className="home-title">ShonenScrolls</h1>
            <p className="home-description">Dive into the world of manga!</p>
            <div className="manga-list">
                {mangas.map((manga) => (
                    <Link key={manga.id} to={`/reading/${manga.id}`}>
                        <div className="manga-card">
                            <img
                                src={`${API_BASE}${manga.coverImage}`}
                                alt={manga.title}
                                className="manga-cover"
                            />
                            <h3 className="manga-title">{manga.title}</h3>
                            <div className="manga-details">
                                <p>Author: {manga.author}</p>

                                <div
                                    className={`favorite-icon-button ${isLikedByUser(manga) ? "favorited" : ""}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleLikeToggle(manga.id, isLikedByUser(manga));
                                    }}
                                >
                                    <i className="fas fa-heart">Favorite</i>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
