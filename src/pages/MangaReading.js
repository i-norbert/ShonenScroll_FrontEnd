import React, { useState, useEffect, useContext } from "react";
import "./MangaPage.css";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faExpand, faXmark} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../UserContext";

const API_BASE = "https://shonenscroll-backend.onrender.com";

const MangaPage = () => {
    const { id } = useParams();
    const [manga, setManga] = useState(null);
    const [currentChapter, setCurrentChapter] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false); // ← fullscreen state

    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const response = await fetch(`${API_BASE}/manga/${id}`);
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                data.Chapters.sort((a, b) => parseInt(a.title) - parseInt(b.title));
                setManga(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchManga();
    }, [id]);

    const mangaPages = manga?.Chapters[currentChapter]?.Pages || [];
    const currentComments = (manga?.Chapters[currentChapter]?.Comments || []).sort(
        (a, b) => b.likes - a.likes
    );

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

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !user?.id) return;

        setCommentSubmitting(true);
        const chapterId = manga.Chapters[currentChapter].id;

        try {
            await fetch(`${API_BASE}/manga/chapter/${chapterId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cuserId: user.id,
                    content: newComment,
                }),
            });

            const response = await fetch(`${API_BASE}/manga/${id}`);
            const updatedData = await response.json();
            updatedData.Chapters.sort((a, b) => parseInt(a.title) - parseInt(b.title));
            setManga(updatedData);
            setNewComment("");
        } catch {
            alert("Failed to post comment");
        } finally {
            setCommentSubmitting(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!manga || !manga.Chapters.length) return <p>No chapters found.</p>;

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
                            <>
                                <img
                                    src={`${API_BASE}${mangaPages[currentPage].imageUrl}`}
                                    alt={`Manga Page ${currentPage + 1}`}
                                    className="manga-image enlarged"
                                />
                                <div className="fullscreen-toggle-wrapper">
                                    <button
                                        className="fullscreen-toggle"
                                        onClick={() => setIsFullscreen(true)}
                                        title="Enter Fullscreen"
                                    >
                                        <FontAwesomeIcon icon={faExpand} />
                                    </button>
                                </div>

                            </>
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

                <div className="comments-section">
                    <h3>Comments</h3>
                    {user ? (
                        <div className="comment-form">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                            />
                            <button onClick={handleCommentSubmit} disabled={commentSubmitting}>
                                {commentSubmitting ? "Posting..." : "Post Comment"}
                            </button>
                        </div>
                    ) : (
                        <p>Please log in to comment.</p>
                    )}
                    {currentComments.length === 0 ? (
                        <p>No comments yet. Be the first!</p>
                    ) : (
                        <ul className="comment-list">
                            {currentComments.map((comment) => (
                                <li key={comment.id} className="comment">
                                    <p>{comment.content}</p>
                                    <small>Likes: {comment.likes || 0}</small>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {isFullscreen && (
                <div className="fullscreen-overlay">
                    <button className="close-fullscreen" onClick={() => setIsFullscreen(false)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <button className="page-button left" onClick={prevPage} disabled={currentPage === 0}>
                        ❮
                    </button>
                    <img
                        src={`${API_BASE}${mangaPages[currentPage].imageUrl}`}
                        alt={`Page ${currentPage + 1}`}
                        className="fullscreen-image"
                    />
                    <button
                        className="page-button right"
                        onClick={nextPage}
                        disabled={currentPage >= mangaPages.length - 1}
                    >
                        ❯
                    </button>
                </div>
            )}
        </div>
    );
};

export default MangaPage;
