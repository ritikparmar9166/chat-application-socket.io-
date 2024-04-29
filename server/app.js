import  express  from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors"

const port = 3000;
const app = express();

const server = new createServer(app); // creating a server and passing our app in it
const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["get", "post"],
        credentials: true,
    }
});   //creating instance of circuit (io ka matlab circuit ki baat)

app.use(cors({
    origin: "//http://localhost:5173",
    methods: ["get", "post"],
    credentials: true,
}));

app.get("/", (req, res)=>{
    res.send("Hello World!");
})

io.on("connection", (socket)=>{
    console.log("user connected", socket.id);
    // socket.emit("welome", `welcome to the server, ${socket.id}`);

    socket.on("message", (data)=>{
        console.log(data);
        // io.emit("receive-message", data);
        io.to(data.room).emit("receive-message", data.message);     //to send the message to particular room
    })

    socket.on("join-room", (room)=>{
        // console.log(data);
        socket.join(room);             //used to join a particular room
    })

    socket.on("disconnect",()=>{
        console.log("User Disconnected", socket.id);
    })
})  // this is how we have created a circuit



server.listen(port, ()=>{console.log(`server is running on port ${port}`)});