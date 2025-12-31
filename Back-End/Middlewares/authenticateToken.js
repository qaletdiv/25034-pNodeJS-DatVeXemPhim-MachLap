const jwt = require("jsonwebtoken");
const { User } = require("../Models");

const authenticateToken = (req, res, next) => {
    // Lấy token từ header authorization
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({ message: "Yeu cau Token xac thuc!!" });
    }

    //verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedPayload) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: "Token da het han !!" });
            }
            // cac loi jwt khac , chu ki sai , dinh dang sai
            return res.status(403).json({ message: "Token khong hop le !!" });
        }

        const userId = decodedPayload.userId;

        if (!userId) {
            return res.status(403).json({ message: "Token khong hop le (thieu thong tin nguoi dung)!!" });
        }

        // tim user trong database de lay thong tin
        try {
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(401).json({ message: "Xac thuc that bai (nguoi dung khong ton tai)" });
            }

            req.user = user;
            next()

        } catch (dbErr) {
            console.error("loi khi truy cap nguoi dung trong authenticateToken", dbErr);
            next(dbErr);
        }
    })


}

module.exports = authenticateToken;