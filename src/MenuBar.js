
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.js";
import Home from "./pages/Home.js";
import Latest from "./pages/Latest.js";
import Hottest from "./pages/Hottest.js";
import Search from "./pages/Search.js";
import Register from "./pages/Register.js";
import MangaReading from "./pages/MangaReading.js";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import FriendManager from "./pages/FriendManager";
import ChatPage from "./pages/ChatPage";
import ChatWindow from "./pages/ChatWindow";

export default function MenuBar() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="latest" element={<Latest />} />
                    <Route path="hottest" element={<Hottest />} />
                    <Route path="search" element={<Search />} />
                    <Route path="register" element={<Register />} />
                    <Route path="search" element={<Search />} />
                    <Route path="login" element={<Login />} />
                    <Route path="myprofile" element={<UserProfile />} />
                    <Route path="friends" element={<FriendManager />} />
                    <Route path="reading/:id" element={<MangaReading />}/>
                    <Route path="chats" element={<ChatPage />} />
                    <Route path="/chat/:id" element={<ChatWindow />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

