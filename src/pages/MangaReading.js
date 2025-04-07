import React, { useState, useEffect, useContext } from "react";
import "./MangaPage.css";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faExpand,
    faXmark,
    faHeart as solidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../UserContext";
import API_BASE from "../ApiBase";

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
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchMangaData();
        incrementViews(); // trigger views counter
    }, [id]);

    const fetchMangaData = async () => {
        try {
            const res = await fetch(`${API_BASE}/manga/${id}`);
            const data = await res.json();
            data.Chapters.sort((a, b) => parseInt(a.title) - parseInt(b.title));
            setManga(data);
        } catch (err) {
            setError("Failed to load manga");
        } finally {
            setLoading(false);
        }
    };

    const incrementViews = async () => {
        try {
            await fetch(`${API_BASE}/manga/${id}/view`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user?.userid }), // optional
            });
        } catch (err) {
            console.error("Failed to increment views:", err);
        }
    };

    const currentComments = (manga?.Chapters[currentChapter]?.Comments || []).sort(
        (a, b) => b.likes - a.likes
    );
    const mangaPages = manga?.Chapters[currentChapter]?.Pages || [];

    const hasUserLiked = (comment) => {
        return comment.Users?.some((u) => u.userid === user?.userid);
    };

    const toggleLike = async (commentId, liked) => {
        if (!user) return;
        const method = liked ? "DELETE" : "POST";
        const endpoint = liked ? "unlike" : "like";
        const res = await fetch(`${API_BASE}/manga/comment/${commentId}/${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.userid }),
        });

        if (res.ok) fetchMangaData();
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !user?.userid) return;

        setCommentSubmitting(true);
        const chapterId = manga.Chapters[currentChapter].id;
        try {
            await fetch(`${API_BASE}/manga/chapter/${chapterId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cuserId: user.userid,
                    content: newComment,
                }),
            });

            setNewComment("");
            fetchMangaData();
        } catch {
            alert("Failed to post comment");
        } finally {
            setCommentSubmitting(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

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
                                    onClick={() => {
                                        setCurrentChapter(index);
                                        setCurrentPage(0);
                                    }}
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
                <p className="manga-views">👁️ {manga.views} views</p>

                <div className="manga-page-wrapper">
                    <button
                        className="page-button left"
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    >
                        ❮
                    </button>
                    <div className="manga-page-content">
                        {mangaPages.length > 0 ? (
                            <>
                                <img
                                    src={`${API_BASE}${mangaPages[currentPage].imageUrl}`}
                                    alt={`Page ${currentPage + 1}`}
                                    className="manga-image enlarged"
                                />
                                <div className="fullscreen-toggle-wrapper">
                                    <button onClick={() => setIsFullscreen(true)} title="Enter Fullscreen">
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
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, mangaPages.length - 1))
                        }
                    >
                        ❯
                    </button>
                </div>

                <div className="chapter-navigation">
                    <button
                        onClick={() => setCurrentChapter((c) => Math.max(0, c - 1))}
                        disabled={currentChapter === 0}
                    >
                        Previous Chapter
                    </button>
                    <button
                        onClick={() =>
                            setCurrentChapter((c) => Math.min(c + 1, manga.Chapters.length - 1))
                        }
                        disabled={currentChapter === manga.Chapters.length - 1}
                    >
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
                            {currentComments.map((comment) => {
                                const liked = hasUserLiked(comment);
                                return (
                                    <li key={comment.id} className="comment">
                                        <img
                                            src={comment.User?.profilePicture}
                                            alt="User"
                                            className="comment-avatar"
                                        />
                                        <div className="comment-body">
                                            <div className="comment-header">
                                                <small className="comment-username">{comment.User?.username}</small>
                                                <small className="comment-date">
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </small>
                                            </div>
                                            <p className="comment-content">{comment.content}</p>
                                            <div className="comment-actions">
                                                <button
                                                    onClick={() => toggleLike(comment.id, liked)}
                                                    className="like-button"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={solidHeart}
                                                        className={liked ? "liked" : "not-liked"}
                                                    />
                                                    <span>{comment.likes}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {isFullscreen && (
                <div className="fullscreen-overlay">
                    <button className="close-fullscreen" onClick={() => setIsFullscreen(false)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <button
                        className="page-button left"
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    >
                        ❮
                    </button>
                    <img
                        src={`${API_BASE}${mangaPages[currentPage].imageUrl}`}
                        alt={`Page ${currentPage + 1}`}
                        className="fullscreen-image"
                    />
                    <button
                        className="page-button right"
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, mangaPages.length - 1))
                        }
                    >
                        ❯
                    </button>
                </div>
            )}
        </div>
    );
};

export default MangaPage;
