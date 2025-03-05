import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { socket } from "./../../utils/socket";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import { useSearchParams } from "react-router-dom";

import {
  Box,
  Card,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Paper,
  Fade,
  PaperProps,
} from "@mui/material";
import apiAgent from "../../utils/apiAgent";
import { PaginationResponse } from "../../utils/commonTypes";

// Get user info
const currentUser = localStorage.getItem("user");
const currentUserId = currentUser && JSON.parse(currentUser)?.id;

interface ConversationProps {
  listingRequestId: string | number;
  senderId: string;
  receiverId: string;
  message?: string;
  onDisconected?: any;
}

const ChatContainer = styled(Card)(({ theme }) => ({
  // maxWidth: "400px",
  width: "100%",
  margin: "20px auto",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  height: "600px",
  display: "flex",
  flexDirection: "column",
}));

const MessageContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#e0e0e0",
    borderRadius: "3px",
  },
});
interface MessageProps extends PaperProps {
  userid: string;
}

const Message = styled(Paper)<MessageProps>(({ userid }) => ({
  padding: "10px 16px",
  borderRadius:
    userid === currentUserId ? "16px 16px 0 16px" : "16px 16px 16px 0",
  backgroundColor: userid === currentUserId ? "#2196f3" : "#f5f5f5",
  color: userid === currentUserId ? "#fff" : "#333",
  maxWidth: "80%",
  marginBottom: "12px",
  marginLeft: userid === currentUserId ? "auto" : "0",
  marginRight: userid === currentUserId ? "0" : "auto",
  position: "relative",
  transition: "all 0.3s ease",
}));

const InputContainer = styled(Box)({
  padding: "16px",
  borderTop: "1px solid #eee",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const ConversationComponent = ({
  listingRequestId,
  senderId,
  receiverId,
  message,
}: ConversationProps) => {
  const [searchParams] = useSearchParams();
  const [paginationParams, setSearchParams] = useState({
    limit: searchParams.get("limit") || 100,
    page: searchParams.get("page") || 1,
    dir: searchParams.get("page") || "ASC",
    sortBy: searchParams.get("page") || "createdDate",
  });
  const [messages, setMessages] = useState<ConversationProps[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    getConversation();

    // Join the conversation room
    socket.emit("joinConversation", listingRequestId);

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      if (listingRequestId === data) setMessages((prev) => [...prev, data]);
      console.log("unread message", data);
    });

    socket.on("connect", () => {
      console.log("connect to live chat. UserID: " + currentUser);
    });

    // Cleanup on unmount
    return () => {
      // socket.disconnect();
      socket.off("receiveMessage");
    };
  }, [listingRequestId]);

  const getConversation = async () => {
    let searchQueryParams: string = `limit=${paginationParams.limit}&page=${paginationParams.page}&dir=${paginationParams.dir}&sortBy=${paginationParams.sortBy}`;

    (async () => {
      try {
        const response: PaginationResponse =
          await apiAgent.ListingRequests.getConversationByRequestId(
            listingRequestId,
            searchQueryParams
          );
        if (response) {
          // set messages
          setMessages(response.results);
        }
      } catch (error) {
        console.log(error);
        window.alert("error");
      }
    })();
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      const messageData = {
        listingRequestId,
        senderId: senderId,
        receiverId: receiverId,
        message: newMessage,
      };

      // Send message to the backend
      socket.emit("sendMessage", messageData);
      console.log("message sent");
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <ChatContainer role="region" aria-label="Chat interface">
      <MessageContainer>
        {messages.map((message, index) => (
          <Fade in={true} key={index} timeout={500}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              {message.senderId !== currentUserId && (
                <Avatar sx={{ mr: 1, bgcolor: "#2196f3" }}>
                  <PersonIcon />
                </Avatar>
              )}
              <Message userid={message.senderId}>
                <Typography variant="body1">{message.message}</Typography>
              </Message>
            </Box>
          </Fade>
        ))}
        <div ref={messagesEndRef} />
      </MessageContainer>
      <InputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          aria-label="Message input"
          multiline
          maxRows={3}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!newMessage.trim()}
          aria-label="Send message"
          sx={{
            backgroundColor: "#2196f3",
            color: "white",
            "&:hover": {
              backgroundColor: "#1976d2",
            },
            "&.Mui-disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
};
