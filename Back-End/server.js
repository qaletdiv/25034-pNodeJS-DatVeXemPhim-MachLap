require("dotenv").config(); // load env truoc tien
const express = require("express");
const BookRoutes = require("./Routes/bookRouter");
const fs = require("fs").promises;
const path = require("path");


const app = express();
const PORT = 3000;

// const limitmer = rateLimit({
//     max: 60,// gioi han 60 request
//     windowMs: 10 * 60 * 1000, // trong vong 10phut
//     standardHeaders: true,
//     legacyHeaders: false
// })

// app.use(helmet()); // set security cho HTTP headers
// app.use("/api", limitmer) // áp dụng cho rate limit middleware api call
// app.use(express.static(path.join(__dirname, "public")));




// app.use(requestLoggerMiddleWare);
app.use(express.json()); // là middleware dùng để parse dữ liệu của body dạng JSON

app.use('/api/books', BookRoutes);




// app.use(errorHandlemiddleware);

// db.sequelize.authenticate()
//     .then(() => {
//         console.log("ket noi db thanh cong");
//     }).catch((err) => {
//         console.error("Khong the ket noi DB")
//     })

app.listen(PORT, () => {
    console.log("Server dang chay ...");
})