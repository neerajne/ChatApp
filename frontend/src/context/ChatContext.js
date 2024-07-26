import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { createContext } = require("react");

const chatContext = createContext();

export const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [selectedChats, setSelectedChats] = useState();
  const [chats, setChats] = useState([]); //FOR POPULATING ALL OF OUR CHATS
  const[notification , setNotification] = useState([]);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInformation"));
    setUser(userInfo);
    console.log(user);

    if (!userInfo) {
      navigate("/ ");
    }
  }, [navigate]);

  const value = {
    user,
    setUser,
    chats,
    setChats,
    selectedChats,
    setSelectedChats,
    notification,
    setNotification
  };

  return <chatContext.Provider value={value}>{children}</chatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(chatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
