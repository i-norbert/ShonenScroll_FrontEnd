import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

        const API_BASE = "http://localhost:5000"; // Updated API base URL

const Home = () => {
    const [mangas, setMangas] = useState([]);
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
                setMangas(shuffledMangas.slice(0, 12));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMangas();
    }, []);

    if (loading) {
        return <div className="loading">Loading random mangas...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="home-container">
            <h1 className="home-title">ShonenScrolls</h1>
            <p className="home-description">Dive into the world of manga!</p>
            <h2 className="random-manga-title">12 random manga</h2>
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
