import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import "./navstyle.css";
import { UserContext } from "../UserContext";
import { FaEnvelope } from "react-icons/fa"; // 📩 Font Awesome envelope

const Layout = () => {
    const { user, logout } = useContext(UserContext);

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

                    {!user ? (
                        <>
                            <li className="reg">
                                <Link to="/register">Register</Link>
                            </li>
                            <li className="reg">
                                <Link to="/login">Login</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to={`/chats`} className="message-link" title="Messages">
                                    <FaEnvelope className="message-icon" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/friends">Friends</Link>
                            </li>
                            <li>
                                <Link to="/myprofile" className="profile-link">
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
