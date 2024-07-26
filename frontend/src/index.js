import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { App } from "./App.js";
import { ChatProvider } from "./context/ChatContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
    <Router>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
      </ChatProvider>
    </Router>

);
