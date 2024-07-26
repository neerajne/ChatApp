import { useState } from "react";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Input,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useChat } from "../../context/ChatContext.js";
import { ProfileModel } from "./ProfileModel.js";
import { useNavigate } from "react-router-dom";
import { ChatLoading } from "../ChatLoading.js";
import { UserListItem } from "../userAvatar/UserListItem.js";
import { getSender } from "../../config/chatLogic.js";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://quickchatapp.onrender.com";

export const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    user,
    selectedChats,
    setSelectedChats,
    chats,
    setChats,
    notification,
    setNotification,
  } = useChat();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const navigate = useNavigate();
  const logOutHandler = () => {
    localStorage.removeItem("userInformation");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something to search",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(
        `${API_BASE_URL}/api/users/signUp?search=${search}`,
        config
      );
      const data = response.data;

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response ? error.response.data : "Error occurred",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      if (!userId) {
        toast({
          title: "User ID",
          description: "ID not found for creating chat",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post(
        `${API_BASE_URL}/api/chats/`,
        { userId },
        config
      );
      const result = response.data;
      if (!chats.find((c) => c._id === result._id)) {
        setChats([result, ...chats]);
      }
      setSelectedChats(result);
      setLoadingChat(false);
      toast({
        title: "Chat created successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "bottom-left",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Chat creation failed",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="0.3125rem"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <span className="material-icons">search</span>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search user
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1} position="relative">
              <Box position="relative" display="inline-block">
                <BellIcon fontSize="2xl" m={1} />
                {notification.length > 0 && (
                  <Box
                    position="absolute"
                    top="-2px"
                    right="-2px"
                    px={2}
                    py={1}
                    fontSize="xs"
                    fontWeight="bold"
                    lineHeight="none"
                    color="white"
                    transform="translate(50%,-50%)"
                    bg="red.500"
                    rounded="full"
                  >
                    {notification.length}
                  </Box>
                )}
              </Box>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChats(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message from ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                name={user.name}
                src={user.pic}
                cursor="pointer"
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logOutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search user"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.length > 0 &&
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
