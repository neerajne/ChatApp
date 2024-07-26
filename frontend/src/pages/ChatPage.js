import { useChat } from "../context/ChatContext";
import { SideDrawer } from "../components/miscellaneous/SideDrawer.js";
import { MyChat } from "../components/miscellaneous/MyChat.js";
import { ChatBox } from "../components/miscellaneous/ChatBox.js";
import { Box } from "@chakra-ui/react";
import { useState } from "react";
export const ChatPage = () => {
  const { user } = useChat();
  const [fetchAgain, setFetchAgain] = useState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        p={"10px"}
      >
        {user && (
          <MyChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

