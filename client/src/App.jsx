import { Container, TextField, Typography, Button, Box, Stack} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
const App = () => {
  const socket = useMemo(()=>io("http://localhost:3000"),[]);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  
  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message, room});
    setMessage("");
  };
  const HandleJoin = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    }); 

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{height:500}}/>

     
      <Typography variant="h6" component="div" gutterBottom> 
         {socketID}
      </Typography>
      

      <form onSubmit={HandleJoin}>
        <h5>Join room</h5>
      <TextField
          value={roomName}
          onChange={e=>setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={e=>setMessage(e.target.value)}
          id="outlined-basic"
          label="message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={e=>setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />

        <Button type="submit" variant="contained" color="primary">
          send
        </Button>
      </form>
      <Stack>
        {messages.map((message, index) => (
          <Typography key={index} variant="body1">
            {message}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
