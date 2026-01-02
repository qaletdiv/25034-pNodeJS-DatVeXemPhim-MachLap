const jwt = require("jsonwebtoken");
const { User } = require("../Models");

const authenticateToken = (req, res, next) => {
  // get token from header authorization
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Yêu cầu xác thực token !!" });
  }

  //verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedPayload) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token hết hạn !!" });
      }
      // orther error , sign false
      return res.status(403).json({ message: "Token không hợp lệ !!" });
    }

    const userId = decodedPayload.userId;

    if (!userId) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ (thiếu thông tin người dùng)!!" });
    }

    // Find user in DB
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Xác thực thất bại người dùng không tồn tại" });
      }

      req.user = user;
      next();
    } catch (dbErr) {
      console.error("error when access in authenticateToken", dbErr);
      next(dbErr);
    }
  });
};

module.exports = authenticateToken;
