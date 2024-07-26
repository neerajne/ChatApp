import React, { useEffect } from "react";
import { ChakraProvider, Container, Box, Text, TabList,Tab, TabPanel,TabPanels } from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import { Login } from "../components/Authentication/Login";
import { SignUp } from "../components/Authentication/SignUp";
import { useNavigate } from "react-router-dom";
export const HomePage = () => {
  const navigate = useNavigate()
  useEffect(() =>{
     const userInfo = JSON.parse(localStorage.getItem("userInformation"));
     if(userInfo){
      navigate('/chats')
     }
  },[])
  return (
    <ChakraProvider>
      <Container maxW="xl" centerContent>
        <Box
          display="flex"
          justifyContent="center"
          p={3}
          bg="white"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize="4xl" fontFamily="Work sans">
            Talk-A-Tive
          </Text>
        </Box>

        <Box
          bg={"white"}
          w={"100%"}
          p={2}
          color={"black"}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Tabs variant="soft-rounded" >
            <TabList mb={"1em"}>
              <Tab width={"50%"}>Login</Tab>
              <Tab width={"50%"}>SignUp</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {<Login/>}
              </TabPanel>
              <TabPanel>
                {<SignUp/>}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </ChakraProvider>
  );
};
