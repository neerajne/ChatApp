import React, { useState } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  Input,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  Spinner,
} from "@chakra-ui/react";
import { useChat } from "../../context/ChatContext";
import { UserBadgeItem } from "../userAvatar/UserBadgeItem.js";
import axios from "axios";
import { UserListItem } from "../userAvatar/UserListItem.js";

export const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { user, selectedChats, setSelectedChats, chats, setChats } = useChat();
  const toast = useToast();

  const handleLeaveGroup = async ({}) => {
    console.log("handleLeaveGroup called"); // Debug log

    if (!user) {
      toast({
        title: "User not found",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      onClose();
      return;
    }

    // Check if the user is part of the group
    if (!selectedChats.users.some((chatUser) => chatUser._id === user._id)) {
      toast({
        title: "You are not a member of this group",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      onClose();
      return;
    }

    // Ensure you are not the only admin
    if (
      user._id === selectedChats.groupAdmin._id &&
      selectedChats.users.length === 1
    ) {
      toast({
        title: "You cannot leave the group as the only admin",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      onClose();
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.put(
        "http://localhost:8080/api/chats/groupRemove",
        {
          chatId: selectedChats._id,
          removeUser: user._id,
        },
        config
      );
      const result = response.data;

      if (result.groupRemoved) {
        toast({
          title: "Group removed",
          description: "You were the only admin. The group has been deleted.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom-left",
        });
      } else {
        toast({
          title: "You have left the group",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom-left",
        });
      }

      setFetchAgain(!fetchAgain); // Trigger a re-fetch
      onClose(); // Close the modal
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "An error occurred while leaving the group",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Please enter new name to rename group",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.put(
        "http://localhost:8080/api/chats/rename",
        {
          chatId: selectedChats._id,
          newName: groupChatName,
        },
        config
      );
      const data = response.data;
      console.log(data);
      toast({
        title: "Group Name Changed",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      setSelectedChats(data);
      setRenameLoading(false);
      
      setFetchAgain(!fetchAgain); // Optionally trigger a re-fetch
      onClose(); // Close the modal after renaming
      setGroupChatName("");
    } catch (error) {
      toast({
        title: "Oops! Some error occurred",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoading(false);
    }
  };

  const handleRemove = async (u) => {
    console.log("handleRemove called"); // Add this to debug
    if (!user) {
      toast({
        title: "User not found to remove",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      onClose();
      return;
    }
    if (selectedChats.users.length <= 2) {
      toast({
        title: "Less users",
        description: "Cannot remove more users",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      onClose();
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.put(
        "http://localhost:8080/api/chats/groupRemove",
        {
          chatId: selectedChats._id,
          removeUser: u._id,
        },
        config
      );
      const result = response.data;
      console.log(result);
      setSelectedChats(result);
      fetchMessages(); // Update selectedChats with the result
      setFetchAgain(!fetchAgain); // Optionally trigger a re-fetch
      toast({
        title: "Success",
        description: "User removed successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while removing the user",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleAdd = async (newuser1) => {
    console.log("Current user:", user);
    console.log("Selected chat:", selectedChats);
    console.log("User to add:", newuser1);

    // Check if the user is already in the group
    if (selectedChats.users.find((user) => user._id === newuser1._id)) {
      toast({
        title: "User already in the group!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      return; // No need to close the modal here, just return
    }

    if (user.id !== selectedChats.groupAdmin._id) {
      toast({
        title: "Only admin can add users!",
        status: "error",
        duration: 4000,
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
      const response = await axios.put(
        "http://localhost:8080/api/chats/groupAdd",
        {
          chatId: selectedChats._id,
          newUser: newuser1._id, // Use the passed user object correctly
        },
        config
      );
      const result = response.data;
      console.log(result);
      setSelectedChats(result); // Update selectedChats with the result
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({
        title: "Success",
        description: "User added successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      onClose();
    } catch (error) {
      toast({
        title: error.message || "An error occurred",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

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
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            fontSize={"35px"}
            fontFamily={"Work sans"}
          >
            {selectedChats?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChats.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                backgroundColor={"teal"}
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display={"flex"}>
              <Input
                placeholder="Add users to group"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAdd(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleLeaveGroup()}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
