require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./src/db/db");
const http = require("http");
const { Server } = require("socket.io");

connectDb();
const httpserver = http.createServer(app);

const io = new Server(httpserver, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);      

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
  });


  socket.on("send-message", ({ roomId, message, sender }) => {
    io.to(roomId).emit("receive-message", {
      sender,
      message,
      time: new Date().toISOString(), 
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpserver.listen(3000, () => {
  console.log("Server running on port 3000");
});


// User A browser open → socket connect → join room A_B

// User B browser open → socket connect → join room A_B

// User A message type → send-message emit → backend → io.to(roomId).emit → user A & B dono ke frontend me receive-message trigger → messages render

// User B bhi message type → same process, dono frontend update hote hain