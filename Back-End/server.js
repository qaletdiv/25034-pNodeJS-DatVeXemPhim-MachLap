require("dotenv").config(); // load env truoc tien
const express = require("express");
// const postRoutes = require("./routes/postRoutes");
const cors = require("cors");
const authRoutes = require("./Routes/authRouter");
const filmRoutes = require("./Routes/filmRouter");
const rateLimit = require("express-rate-limit");
const errorHandlemiddleware = require("./Middlewares/errorHandler");
const requestLoggerMiddleWare = require("./Middlewares/requestLogger");
const db = require("./Models")
const helmet = require("helmet");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(cors());

const limitmer = rateLimit({
    max: 100,// gioi han 100 request
    windowMs: 15 * 60 * 1000, // trong vong 15phut
    standardHeaders: true,
    legacyHeaders: false
})

app.use(helmet()); // set security cho HTTP headers
app.use("/api", limitmer) // áp dụng cho rate limit middleware api call

app.use(express.static(path.join(__dirname, "public")));

app.use(requestLoggerMiddleWare);
app.use(express.json()); // là middleware dùng để parse dữ liệu của body dạng JSON

app.use('/api/films', filmRoutes);

app.use('/api', authRoutes);




app.use(errorHandlemiddleware);

db.sequelize.authenticate()
    .then(() => {
        console.log("ket noi db thanh cong");
    }).catch((err) => {
        console.error("Khong the ket noi DB")
    })

app.listen(PORT, () => {
    console.log("Server dang chay ...");
})