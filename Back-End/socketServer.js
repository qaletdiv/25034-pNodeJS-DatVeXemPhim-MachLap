// socketServer.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("join_showtime", (showtimeId) => {
      socket.join(`showtime_${showtimeId}`);
      console.log(`➡️ Join room showtime_${showtimeId}`);
    });

    socket.on("leave_showtime", (showtimeId) => {
      socket.leave(`showtime_${showtimeId}`);
      console.log(`⬅️ Leave room showtime_${showtimeId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};
