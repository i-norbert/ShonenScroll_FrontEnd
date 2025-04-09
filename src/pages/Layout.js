import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import "./navstyle.css";
import { UserContext } from "../UserContext";
import { FaHome, FaFire, FaSearch, FaUserFriends, FaUserPlus, FaSignInAlt, FaEnvelope, FaUserCircle, FaClock } from "react-icons/fa";

const Layout = () => {
    const { user, logout } = useContext(UserContext);

    return (
        <>
            <nav className="NavBar">
                <ul className="nav-links">
                    <li>
                        <Link to="/" className="nav-item">
                            <FaHome className="icon" />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/latest" className="nav-item">
                            <FaClock className="icon" />
                            <span>Latest</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/hottest" className="nav-item">
                            <FaFire className="icon" />
                            <span>Hottest</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/search" className="nav-item">
                            <FaSearch className="icon" />
                            <span>Search</span>
                        </Link>
                    </li>

                    {!user ? (
                        <>
                            <li>
                                <Link to="/register" className="nav-item">
                                    <FaUserPlus className="icon" />
                                    <span>Register</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="nav-item">
                                    <FaSignInAlt className="icon" />
                                    <span>Login</span>
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/chats" className="nav-item" title="Messages">
                                    <FaEnvelope className="icon" />
                                    <span>Chats</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/friends" className="nav-item">
                                    <FaUserFriends className="icon" />
                                    <span>Friends</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/myprofile" className="nav-item profile-link">
                                    <img
                                        src={user.profilePicture}
                                        alt="profile"
                                        className="profile-pic"
                                    />
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            <Outlet />
        </>
    );
};

export default Layout;
