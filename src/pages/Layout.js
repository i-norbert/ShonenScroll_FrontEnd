import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navstyle.css";

const Layout = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check sessionStorage for login state
        const storedUser = sessionStorage.getItem("loggedInUser");
        if (storedUser) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("loggedInUser"); // Remove login state
        setIsLoggedIn(false);
    };

    return (
        <>
            <nav className="NavBar">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/latest">Latest</Link>
                    </li>
                    <li>
                        <Link to="/hottest">Hottest</Link>
                    </li>
                    <li>
                        <Link to="/search">Search</Link>
                    </li>

                    {!isLoggedIn ? (
                        <>
                            <li className="reg">
                                <Link to="/register">Register</Link>
                            </li>
                            <li className="reg">
                                <Link to="/login">Login</Link>
                            </li>
                        </>
                    ) : (
                        <li className="reg">
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </li>
                    )}
                </ul>
            </nav>

            <Outlet />
        </>
    );
};

export default Layout;
