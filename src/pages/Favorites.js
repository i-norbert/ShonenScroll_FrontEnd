import React, {useContext, useEffect, useState} from "react";
import {data, Link} from "react-router-dom"; // ✅ Add Link from react-router-dom
import "./Latest.css";
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
    }, []);

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
                {mangas.map((manga) => {

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
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
