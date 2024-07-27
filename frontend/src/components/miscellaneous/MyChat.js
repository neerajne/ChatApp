import axios from "axios";
import { Box, Button, Stack, useToast, Text } from "@chakra-ui/react";
import { ChatLoading } from "../ChatLoading.js";
import { useChat } from "../../context/ChatContext";
import { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/chatLogic.js";
import { GroupChatModel } from "./GroupChatModel.js";

export const MyChat = ({ fetchAgain, setFetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const { user, selectedChats, setSelectedChats, chats, setChats } = useChat();
  const toast = useToast();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInformation"));
    setLoggedUser(userInfo);
    if (user && user.token) {
      fetchChats();
    }
  }, [user?.token]); // Only re-run if the user's token changes // Dependency on `user` only

  const fetchChats = async () => {
    if (!user || !user.token) {
      console.log("No user or token available");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/chats`, // Use BASE_URL
        config
      );
      const result = response.data;
      setChats(result);
      toast({
        title: "Fetched successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Error fetching chats",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <Box
      display={{ base: selectedChats ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth=".0625rem"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModel>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New group chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChats(chat)}
                cursor="pointer"
                bg={selectedChats === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChats === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat && loggedUser
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};
