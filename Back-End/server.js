require("dotenv").config(); // load file env first
const express = require("express");
const cors = require("cors");
const authRoutes = require("./Routes/authRouter");
const movieRoutes = require("./Routes/movieRouter");
const categoryRoutes = require("./Routes/categoryRouter");
const movieTheaterRoutes = require("./Routes/movieTheaterRouter");
const seatRoutes = require("./Routes/seatRouter");
const rateLimit = require("express-rate-limit");
const errorHandleMiddleware = require("./Middlewares/errorHandler");
const requestLoggerMiddleWare = require("./Middlewares/requestLogger");
const db = require("./Models");
const helmet = require("helmet");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const releaseSeatJob = require("./Jobs/releaseSeat.job");

const app = express();
const PORT = 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());

// set io in app
app.set("io", io);

const limitmer = rateLimit({
  max: 1000, // limit 100 request
  windowMs: 15 * 60 * 1000, // about 15 minute
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet()); // set security for HTTP headers
app.use("/api", limitmer); //apply for rate limit middleware api call

app.use(express.static(path.join(__dirname, "public")));

app.use(requestLoggerMiddleWare);
app.use(express.json()); // is middleware using to parse data of body in format JSON

app.use("/api/movie", movieRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/movieTheater", movieTheaterRoutes);

app.use("/api/seats", seatRoutes);

app.use("/api", authRoutes);

app.use(errorHandleMiddleware);
const now = new Date();
console.log(now, "tetst");

io.on("connection", (socket) => {
  console.log("🟢 socket connected:", socket.id);

  socket.on("join_showtime", (showtimeId) => {
    socket.join(`showtime_${showtimeId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 socket disconnected");
  });
});

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connect Database success !!");

    releaseSeatJob(io);
  })
  .catch((err) => {
    console.error("Unable to connect to Database");
  });

server.listen(PORT, () => {
  console.log("Server is loading ...");
});
