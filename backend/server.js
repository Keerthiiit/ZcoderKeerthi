require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db.js');

// ROUTES
const authRoutes = require('./routes/authroute.js');
const userRoutes = require('./routes/userroutes.js');
const contestRoutes = require('./routes/contestroute.js');
const problemRoutes = require('./routes/problemsroute.js');
const solutionRoutes = require('./routes/solutionroute.js');
const roomRoutes = require('./routes/roomroute.js');
const messageRoutes = require('./routes/messagesroute.js');

// UTILS
const addmessages = require('./utils/admessagetodb.js');
const { userJoin, userLeave, getCurrentUser, getRoomUsers } = require('./utils/socketusers.js');
const formatMessage = require('./utils/socketmessages.js');

// ✅ Check required ENV variables
const requiredEnv = ['MONGO_URL', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.error(`❌ Missing ENV: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const app = express();

// ✅ Allowed origins (LOCAL + PRODUCTION)
const defaultFrontendOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];

const allowedOrigins = (process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : defaultFrontendOrigins)
  .map((origin) => origin.trim())
  .filter(Boolean);

console.log("✅ Allowed Origins:", allowedOrigins);

// ✅ CORS Setup (Production Safe)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS Blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/contests', contestRoutes);
app.use('/problems', problemRoutes);
app.use('/solutions', solutionRoutes);
app.use('/rooms', roomRoutes);
app.use('/messages', messageRoutes);

// ✅ Health Check Route (VERY IMPORTANT for Render)
app.get('/', (req, res) => {
  res.send('✅ Backend running successfully');
});

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// ✅ Socket Events
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('joinRoom', ({ id, handle }) => {
    const user = userJoin(socket.id, handle, id);
    socket.join(user.room);

    socket.emit("recieve-message",
      formatMessage("Zcoder", "Welcome to the discussion room!")
    );

    socket.broadcast.to(user.room)
      .emit("recieve-message",
        formatMessage("Zcoder", `${user.handle} has joined`)
      );

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  socket.on('send-message', ({ handle, text }) => {
    const user = getCurrentUser(socket.id);
    if (!user) return;

    socket.broadcast.to(user.room)
      .emit("recieve-message", formatMessage(handle, text));

    addmessages(user.room, handle, text);
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      socket.broadcast.to(user.room)
        .emit("recieve-message",
          formatMessage("Zcoder", `${user.handle} left`)
        );

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }

    console.log('❌ Socket disconnected:', socket.id);
  });
});

// ✅ PORT (Render Compatible)
const PORT = process.env.PORT || 5000;

// ✅ Start Server
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server start failed:", error);
    process.exit(1);
  }
};

startServer();
