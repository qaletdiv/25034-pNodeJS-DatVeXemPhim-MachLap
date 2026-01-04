require("dotenv").config(); // load file env first
const express = require("express");
const cors = require("cors");
const authRoutes = require("./Routes/authRouter");
const movieRoutes = require("./Routes/movieRouter");
const categoryRoutes = require("./Routes/categoryRouter");
const movieTheaterRoutes = require("./Routes/movieTheaterRouter");
const rateLimit = require("express-rate-limit");
const errorHandleMiddleware = require("./Middlewares/errorHandler");
const requestLoggerMiddleWare = require("./Middlewares/requestLogger");
const db = require("./Models");
const helmet = require("helmet");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(cors());

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

app.use("/api", authRoutes);

app.use(errorHandleMiddleware);

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connect Database success !!");
  })
  .catch((err) => {
    console.error("Unable to connect to Database");
  });

app.listen(PORT, () => {
  console.log("Server is loading ...");
});
