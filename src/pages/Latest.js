import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ Add Link from react-router-dom
import "./Latest.css";

const API_BASE = "https://shonenscroll-backend.onrender.com";

export default function Latest() {
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMangas = async () => {
            try {
                const response = await fetch(`${API_BASE}/manga`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error("Failed to fetch mangas.");
                }

                // Filter mangas that have chapters
                const filteredMangas = data.filter(manga => manga.Chapters.length > 0);

                // Sort mangas by latest chapter date
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
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                                    <p>Author: {manga.author}</p>
                                    <p>
                                        Latest Chapter: {firstChapter.title} -{" "}
                                        {new Date(firstChapter.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
