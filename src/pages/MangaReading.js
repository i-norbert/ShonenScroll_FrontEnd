import React, { useState, useEffect } from "react";
import "./MangaPage.css";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const API_BASE = "https://shonenscroll-backend.onrender.com";

const MangaPage = () => {
    const { id } = useParams();
    const [manga, setManga] = useState(null);
    const [currentChapter, setCurrentChapter] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const response = await fetch(`${API_BASE}/manga/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();

                const sortedChapters = data.Chapters.sort((a, b) => {
                    const aNum = parseInt(a.title);
                    const bNum = parseInt(b.title);
                    return aNum - bNum;
                });
                data.Chapters = sortedChapters;

                setManga(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchManga();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!manga || !manga.Chapters || manga.Chapters.length === 0) return <p>No chapters found.</p>;

    const mangaPages = manga.Chapters[currentChapter]?.Pages || [];

    const nextPage = () => {
        if (currentPage < mangaPages.length - 1) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const nextChapter = () => {
        if (currentChapter < manga.Chapters.length - 1) {
            setCurrentChapter(currentChapter + 1);
            setCurrentPage(0);
        }
    };

    const prevChapter = () => {
        if (currentChapter > 0) {
            setCurrentChapter(currentChapter - 1);
            setCurrentPage(0);
        }
    };

    const handleChapterClick = (index) => {
        setCurrentChapter(index);
        setCurrentPage(0);
    };

    return (
        <div className="manga-page-container">
            <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
                <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <FontAwesomeIcon icon={sidebarOpen ? faChevronLeft : faChevronRight} />
                </button>
                {sidebarOpen && (
                    <>
                        <h3>Chapters</h3>
                        <ul>
                            {manga.Chapters.map((chapter, index) => (
                                <li
                                    key={chapter.id}
                                    className={currentChapter === index ? "active" : ""}
                                    onClick={() => handleChapterClick(index)}
                                >
                                    Chapter {chapter.title}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <div className="manga-content">
                <h2>Chapter {manga.Chapters[currentChapter].title}</h2>
                <div className="manga-page-wrapper">
                    <button className="page-button left" onClick={prevPage} disabled={currentPage === 0}>
                        ❮
                    </button>
                    <div className="manga-page-content">
                        {mangaPages.length > 0 ? (
                            <img
                                src={`${API_BASE}${mangaPages[currentPage].imageUrl}`}
                                alt={`Manga Page ${currentPage + 1}`}
                                className="manga-image enlarged"
                            />
                        ) : (
                            <p>No pages available</p>
                        )}
                    </div>
                    <button
                        className="page-button right"
                        onClick={nextPage}
                        disabled={currentPage >= mangaPages.length - 1}
                    >
                        ❯
                    </button>
                </div>

                <div className="chapter-navigation">
                    <button onClick={prevChapter} disabled={currentChapter === 0}>
                        Previous Chapter
                    </button>
                    <button onClick={nextChapter} disabled={currentChapter >= manga.Chapters.length - 1}>
                        Next Chapter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MangaPage;
