import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  VStack,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

export const Login = () => {
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  //BUTTON HANDLER FUNCTION FOR LOGIN
  const submitHandler = async () => {
    if (!data.email || !data.password) {
      toast({
        title: "Important ",
        description: "All the fields are necessary ",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log("Sending login request with data:", data);
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        data,
        config
      );
      setData({
        email: "",
        password: "",
      });
      toast({
        title: "Login Successful ",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      localStorage.setItem("userInformation", JSON.stringify(response.data));

      //SETTIMEOUT FUNCTION FOR DEPLAYING TO REDIRECT ME IMMEDIATELY TO THE CHATS PAGE SO THAT MY TOAST CAN OCCUR
      setTimeout(() => {
        navigate("/chats");
      }, 1000);
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      toast({
        title: "Problem logging in",
        description: error.response
          ? error.response.data.message
          : error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  //GUEST USER CREDENTIALS FUNCTION
  const GetGuestUserCredentials = async (e) => {
    const guestData = {
      email: "guestUser@gmail.com",
      password: "guestUser",
    };

    setData(guestData);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log("Sending login request with data:", guestData);
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        guestData,
        config
      );
      setData({
        email: "",
        password: "",
      });
      toast({
        title: "Login Successful ",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      localStorage.setItem("userInformation", JSON.stringify(response.data));

      //SETTIMEOUT FUNCTION FOR DEPLAYING TO REDIRECT ME IMMEDIATELY TO THE CHATS PAGE SO THAT MY TOAST CAN OCCUR
      setTimeout(() => {
        navigate("/chats");
      }, 1000);
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      toast({
        title: "Problem logging in",
        description: error.response
          ? error.response.data.message
          : error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    console.log(data);
  };

  //I PUT HANDLER FUNCTION FOR LOGIN
  const onChangeHandler = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
    console.log(name, value);
  };

  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email"
          name="email"
          value={data.email}
          onChange={onChangeHandler}
        ></Input>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your password"
            type={show ? "text" : "password"}
            name="password"
            value={data.password}
            onChange={onChangeHandler}
          ></Input>

          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>

      <Button
        colorScheme="red"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={GetGuestUserCredentials}
      >
        Get guest user credentials
      </Button>
    </VStack>
  );
};
