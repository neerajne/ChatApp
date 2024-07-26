import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useChat } from "../context/ChatContext";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
} from "../config/chatLogic";
import { Avatar, Tooltip } from "@chakra-ui/react";

export const ScrollableChat = ({ messages }) => {
  const { user } = useChat();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", marginBottom: "10px" }} key={m._id}>
            {m.sender._id !== user.id &&
              (isLastMessage(messages, i, user.id) ||
                (i < messages.length - 1 &&
                  messages[i + 1].sender._id !== m.sender._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user.id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                marginTop: isSameSenderMargin(messages, m, i, user.id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};
