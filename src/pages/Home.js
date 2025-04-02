import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "./Home.css";
import mangaReading from "./MangaReading"; // Ensure you create and import this CSS file

const Home = () => {
    const [mangas, setMangas] = useState([]); // To hold fetched mangas
    const [loading, setLoading] = useState(true); // To track loading state
    const [error, setError] = useState(""); // To track errors

    // Fetch random mangas from an API or mock database
    useEffect(() => {
        const fetchMangas = async () => {
            try {
                const response = await fetch("http://10.30.108.3:5000/manga"); // Replace with your API URL
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setMangas(data); // Assuming 'data' contains an array of manga objects
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

            <div className="manga-list">
                {mangas.slice(0, 10).map((manga) => (
                    <Link to={"/reading/"+manga.id}>
                    <div key={manga.id} className="manga-card">
                        <img src={"http://10.30.108.3:5000"+manga.coverImage} alt={manga.title} className="manga-cover" />
                        <h3 className="manga-title">{manga.title}</h3>
                    </div>
                    </Link>
                ))}
            </div>

            <Link to="/reading" >
                <Button className="home-button" variant="contained">
                    Start Reading
                </Button>
            </Link>
        </div>
    );
};

export default Home;