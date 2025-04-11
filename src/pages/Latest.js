import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Latest.css";
import API_BASE from "../ApiBase";
import { UserContext } from "../UserContext";

export default function Latest() {
    const { user } = useContext(UserContext);
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMangas = async () => {
            try {
                const [mangaRes, favoritesRes] = await Promise.all([
                    fetch(`${API_BASE}/manga`),
                    user
                        ? fetch(`${API_BASE}/manga/user/${user.userid}`)
                        : Promise.resolve({ ok: true, json: () => [] }),
                ]);

                if (!mangaRes.ok) throw new Error("Failed to fetch mangas");

                const mangaData = await mangaRes.json();
                const favoritesData = user ? await favoritesRes.json() : [];

                const filteredMangas = mangaData
                    .filter((manga) => manga.Chapters.length > 0)
                    .map((m) => ({
                        ...m,
                        LikedUsers: favoritesData.some((f) => f.id === m.id)
                            ? [{ userid: user.userid }]
                            : [],
                    }));

                filteredMangas.sort((a, b) => {
                    const latestChapterA = a.Chapters[0]?.createdAt;
                    const latestChapterB = b.Chapters[0]?.createdAt;
                    return new Date(latestChapterB) - new Date(latestChapterA);
                });

                setMangas(filteredMangas);
            } catch (err) {
                setError(err.message);
            } finally {
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="manga-page">
            <h2>Latest Manga</h2>
            <div className="manga-list">
                {mangas.map((manga) => {
                    const firstChapter = manga.Chapters[0];
                    if (!firstChapter) return null;

                    return (
                        <Link
                            to={`/reading/${manga.id}`}
                            key={manga.id}
                            className="manga-item-link"
                        >
                            <div className="manga-item">
                                <img
                                    src={API_BASE + manga.coverImage}
                                    alt={manga.title}
                                    className="manga-cover"
                                />
                                <div className="manga-details">
                                    <h3>{manga.title}</h3>
                                    <p>
                                        Latest Chapter: {firstChapter.title} -{" "}
                                        {new Date(firstChapter.createdAt).toLocaleDateString()}
                                    </p>
                                    <div
                                        className={`favorite-icon-button ${
                                            isLikedByUser(manga) ? "favorited" : ""
                                        }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleLikeToggle(manga.id, isLikedByUser(manga));
                                        }}
                                    >
                                        <i className="fas fa-heart" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
