function errorHandlemiddleware(err, req, res, next) {
  console.error("ERROR", err);
  res.status(500).send("Lỗi server !! Vui lòng thử lại sau ");
}

module.exports = errorHandlemiddleware;
