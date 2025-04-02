import React, { useState } from "react";
import "./MangaPage.css";
import {useParams} from "react-router-dom";
import {responsiveFontSizes} from "@mui/material"; // Make sure to create and style your CSS file

const MangaPage = () => {
    const [currentChapter, setCurrentChapter] = useState(0);
    const [pages, setPages] = useState([]); // To hold fetched mangas
    const [loading, setLoading] = useState(true); // To track loading state
    const [error, setError] = useState(""); // To track errors
    const {id} = useParams();
    const fetchMangas = async () => {
        try {
            const response = await fetch("http://10.30.108.3:5000/manga/" + id); // Replace with your API URL
            console.log(response)
            if (response.status !== 200 ) {

                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            setPages(data);

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const mangaPages = pages.Chapters[currentChapter].Pages;

    // State for the current page
    const [currentPage, setCurrentPage] = useState(0);

    // Function to go to the next page
    const nextPage = () => {
        if (currentPage < mangaPages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Function to go to the previous page
    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="manga-page-container">
            <div className="manga-page-content">
                <img
                    src={mangaPages[currentPage].imageUrl}
                    alt={`Manga Page ${currentPage + 1}`}
                    className="manga-image"
                />
            </div>
            <div className="manga-navigation">
                <button onClick={prevPage} disabled={currentPage === 0}>
                    Previous
                </button>
                <span>{`Page ${currentPage + 1} of ${mangaPages.length}`}</span>
                <button onClick={nextPage} disabled={currentPage === mangaPages.length - 1}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default MangaPage;
