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
                            <li className="reg">
                                <button onClick={logout} className="logout-btn">Logout</button>
                            </li>
                            <li>
                                <Link to="/myprofile">
                                    {user.username ? `${user.username}'s Profile` : "My Profile"}
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
