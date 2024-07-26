import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ChatPage } from "../pages/ChatPage";

export const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
