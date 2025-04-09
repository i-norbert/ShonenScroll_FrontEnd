import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_BASE from '../ApiBase';
import "./Home.css";



const Home = () => {
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
                const response = await fetch(`${API_BASE}/manga/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                const shuffledMangas = shuffleArray(data);
                const sortedNewest = [...data].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setNewestMangas(sortedNewest.slice(0, 10));
                setMangas(shuffledMangas.slice(0, 12));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMangas();
    }, []);

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
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
