import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import "./navstyle.css";
import { UserContext } from "../UserContext";

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
                                <Link to="/myprofile" className="profile-link">
                                    <img src={user.profilePicture} alt="profilePicture" className="profile-pic" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/friends">
                                    Friends
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
