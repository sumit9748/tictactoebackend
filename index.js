const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const boardRoute = require("./routes/board");
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT;

var server = require("https").createServer(app);

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
  })
);
app.use(express.json());
// app.use(helmet());
app.use(morgan("common"));
app.use("/connect/auth", authRoute);
app.use("/connect/board", boardRoute);

server.listen(PORT || 8000, () => {
  console.log("Backend server is running!");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let users = [];
let board=['','','','','','','','','']

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
const changeBoard=(newboard)=>{
  board=newboard;
  return board;
}

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on(
    "sendText",
    ({ senderId, receiverId, newboard,lastMove,status,num,type}) => {
      const user = getUser(receiverId);
      const bo=changeBoard(newboard);
      console.log(board)
      console.log(users)
      io.to(user?.socketId).emit("getText", {
        senderId,
        bo,
        lastMove,
        status,
        num,
        type,
      });
    }
  );

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
