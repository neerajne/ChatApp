import { Box, Center } from "@chakra-ui/react";
import { useChat } from "../../context/ChatContext";
import { SingleChat } from "../SingleChat";

export const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, chats, setChats, selectedChats } = useChat();

  return (
    <Box
      display={{ base: selectedChats ? "flex" : "none", md: "flex" }}
      alignItems={"Center"}
      flexDir={"column"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};
