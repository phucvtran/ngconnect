import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";

import {
  Box,
  Card,
  CardContent,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Paper,
  Fade,
  CircularProgress,
  PaperProps,
} from "@mui/material";

const socket: Socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

// TODO: fix it this when we set up reddux store
const currentUser = localStorage.getItem("userInfo");
const currentUserId = currentUser && JSON.parse(currentUser)?.id;

interface ConversationProps {
  listingRequestId: string | number;
  senderId: string;
  receiverId: string;
  message?: string;
}

const ChatContainer = styled(Card)(({ theme }) => ({
  maxWidth: "400px",
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

const Conversation = ({
  listingRequestId,
  senderId,
  receiverId,
  message,
}: ConversationProps) => {
  const [messages, setMessages] = useState<ConversationProps[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // const scrollToBottom = () => {
  //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  useEffect(() => {
    // Join the conversation room
    socket.emit("joinConversation", listingRequestId);

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      console.log("message");
      console.log(data);
      setMessages((prev) => [...prev, data]);
    });

    socket.on("connect", () => {
      console.log("connect to live chat");
    });

    // Cleanup on unmount
    return () => {
      // socket.disconnect();
      socket.off("receiveMessage");
    };
  }, [listingRequestId]);

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

export default Conversation;
