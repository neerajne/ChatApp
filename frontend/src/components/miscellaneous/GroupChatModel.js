import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import {
  Button,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { UserListItem } from "../userAvatar/UserListItem";
import { UserBadgeItem } from "../userAvatar/UserBadgeItem";

export const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = useChat();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    console.log(query);
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:8080/api/users/signUp?search=${query}`,
        config
      );
      const results = response.data;
      console.log("logged", results);
      setLoading(false);
      setSearchResult(results);
    } catch (error) {
      toast({
        title: "Error occurred!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "Warning",
        description: "User already in the group",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToBeDeleted) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToBeDeleted._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({
        title: "Error",
        description: "Please fill all the details!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post(
        "http://localhost:8080/api/chats/group",
        {
          name: groupChatName,
          users: selectedUsers,
        },
        config
      );
      const result = response.data;
      setChats([result, ...chats]);
      onClose();
      toast({
        title: "Success",
        description: "Group chat created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Cannot create group chat",
        description: "Some error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Enter chat name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users eg. John, Bella, Elias"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w={"100%"} display={"flex"} flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {loading ? (
              <Spinner />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
