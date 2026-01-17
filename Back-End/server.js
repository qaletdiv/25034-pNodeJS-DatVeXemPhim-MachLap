require("dotenv").config(); // load file env first
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const db = require("./Models");
const errorHandleMiddleware = require("./Middlewares/errorHandler");
const requestLoggerMiddleWare = require("./Middlewares/requestLogger");
const releaseSeatJob = require("./Jobs/releaseSeat.job");
const authRoutes = require("./Routes/authRouter");
const movieRoutes = require("./Routes/movieRouter");
const categoryRoutes = require("./Routes/categoryRouter");
const movieTheaterRoutes = require("./Routes/movieTheaterRouter");
const seatRoutes = require("./Routes/seatRouter");
const ticketRoutes = require("./Routes/ticketRouter");
const orderRoutes = require("./Routes/orderRouter");
const comboRoutes = require("./Routes/comboRouter");
const socketServer = require("./socketServer");
const orderController = require("../Back-End/Controllers/orderController");

const app = express();
const PORT = 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.LOCAL_HOST_FE,
    credentials: true,
  },
});

global.io = io;

app.use(
  cors({
    origin: process.env.LOCAL_HOST_FE,
    credentials: true,
  })
);

// set io in app
app.set("io", io);

const limitmer = rateLimit({
  max: 300, // limit 300 request
  windowMs: 15 * 60 * 1000, // about 15 minute
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet()); // set security for HTTP headers
app.use("/api", limitmer); //apply for rate limit middleware api call

app.use(express.static(path.join(__dirname, "public")));

app.use(requestLoggerMiddleWare);

// routes/payment.js
app.post(
  "/api/orders/webhook",
  express.raw({ type: "application/json" }),
  orderController.stripeWebhook
);
app.use(express.json()); // is middleware using to parse data of body in format JSON

app.use("/api/movie", movieRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/movieTheater", movieTheaterRoutes);

app.use("/api/seats", seatRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/my-tickets", ticketRoutes);

app.use("/api/combos", comboRoutes);

app.use("/api", authRoutes);

app.use(errorHandleMiddleware);

/* ===== INIT SOCKET ===== */
socketServer(io);

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connect Database success !!");

    server.listen(PORT, () => {
      console.log("Server is loading ...");

      releaseSeatJob(io);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to Database");
  });
