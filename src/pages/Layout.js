import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navstyle.css";


const Layout = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [storedUser, setStoredUser] = useState([]);
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("userId");
        if (token && userId) {
            setStoredUser({ token, userId });
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");// Remove login state
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
                        <Link  to="/hottest">Hottest</Link>
                    </li>
                    <li>
                        <Link  to="/search">Search</Link>
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
                            <a onClick={handleLogout} className="logout-btn">Logout</a>
                        </li>
                    )}
                </ul>
            </nav>

            <Outlet />
        </>
    );
};

export default Layout;
