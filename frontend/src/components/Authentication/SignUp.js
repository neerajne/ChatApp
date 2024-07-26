import axios from "axios";
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
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

export const SignUp = () => {
  const [show, setShow] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

  // Define BASE_URL
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // FUNCTION FOR SIGNUP THE USER
  const onChangeHandler = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // FOR SUBMISSION OF DETAILS IN THE SIGNUP
  const submitHandler = async () => {
    setLoading(true);
    if (!data.name || !data.email || !data.password || !data.confirmPassword) {
      toast({
        title: "Important",
        description: "All fields are necessary",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Warning",
        description: "Password doesn't match",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.post(
        `${BASE_URL}/api/users/signUp`, // Use BASE_URL here
        { ...data, pic },
        config
      );
      console.log("Received response:", response);
      // AGAIN SETTING THE DATA TO EMPTY AFTER SUCCESSFULLY SIGNING IN
      setData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      const responseData = response.data;
      toast({
        title: "Registration Successful",
        description: "Signed in successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      localStorage.setItem("userInformation", JSON.stringify(responseData));
      setLoading(false);
      setTimeout(() => {
        navigate("/chats");
      }, 500);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.response.data.message,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  // FOR IMAGE PROCESSING CLOUDINARY SETUP
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "ddnuzihxz");
      fetch("https://api.cloudinary.com/v1_1/ddnuzihxz/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl id="firstName" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          name="name"
          value={data.name}
          onChange={onChangeHandler}
          autoComplete="off"
        />
      </FormControl>

      <FormControl id="emailInput" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          name="email"
          value={data.email}
          onChange={onChangeHandler}
        />
      </FormControl>

      <FormControl id="passwordInput" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your password"
            type={show ? "text" : "password"}
            name="password"
            value={data.password}
            onChange={onChangeHandler}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmPasswordInput" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Confirm your password"
            name="confirmPassword"
            type={show ? "text" : "password"}
            value={data.confirmPassword}
            onChange={onChangeHandler}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="picInput" isRequired>
        <FormLabel>Upload your Image</FormLabel>
        <Input
          type="file"
          p={"1.5"}
          placeholder="Pic"
          name="pic"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};
