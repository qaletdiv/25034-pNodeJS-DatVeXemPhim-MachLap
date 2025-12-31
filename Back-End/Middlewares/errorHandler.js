function errorHandlemiddleware(err, req, res, next) {
    console.error("ERROR", err);
    res.status(500).send("Loi server !! vui long thu lai sau");
}

module.exports = errorHandlemiddleware;