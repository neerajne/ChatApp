import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useChat } from "../context/ChatContext";
import { getSender, getSenderFull } from "../config/chatLogic";
import { ProfileModel } from "./miscellaneous/ProfileModel";
import { UpdateGroupChatModel } from "../components/miscellaneous/UpdateGroupChatModel";
import "./style.css";
import { ScrollableChat } from "./ScrollableChat.js";
import Lottie from "react-lottie";
import io from "socket.io-client";
import animationData from "../animations/typing.json";

const ENDPOINT = "https://quickchatapp.onrender.com"; // Updated to deployed backend URL
var socket, selectedChatCompare;

export const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    selectedChats,
    setSelectedChats,
    chats,
    setChats,
    notification,
    setNotification,
  } = useChat();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnection, setSocketConnection] = useState(false);
  const [typing, setTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    if (!selectedChats) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://quickchatapp.onrender.com/api/messages/${selectedChats._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChats._id);
    } catch (error) {
      toast({
        title: "Error fetching messages!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnection(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    if (selectedChats) {
      fetchMessages();
      selectedChatCompare = selectedChats;
    }
  }, [selectedChats?._id]); // Only re-run if the chat ID changes
  console.log(notification);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification((prevNotifications) => [
            newMessageReceived,
            ...prevNotifications,
          ]);

          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });
  }, []);

const sendMessage = async (e) => {
  if (e.key === "Enter" && newMessage) {
    socket.emit("stop typing", selectedChats._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "https://quickchatapp.onrender.com/api/messages/",
        {
          content: newMessage,
          chatId: selectedChats._id,
        },
        config
      );
      socket.emit("new message", data);
      setMessages((prevMessages) => [...prevMessages, data]);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error sending message!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
};
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnection) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChats._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChats._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChats ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            fontFamily="Work sans"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChats(null)}
            />
            {!selectedChats.isGroupChat ? (
              <>
                {getSender(user, selectedChats.users)}
                <ProfileModel user={getSenderFull(user, selectedChats.users)} />
              </>
            ) : (
              <>
                {selectedChats.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflow="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                height={20}
                width={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                {<ScrollableChat messages={messages} />}
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired marginTop={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    width={70}
                    options={defaultOptions}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message ..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};
