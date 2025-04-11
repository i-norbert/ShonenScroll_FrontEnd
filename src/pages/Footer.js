import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-social">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 ShonenScrolls. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;
