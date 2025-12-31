const bcrypt = require("bcrypt");
const { User } = require("../Models");
const Sequelize = require("sequelize");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // 1. Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { sub, email, name } = ticket.getPayload();

        // 2. Tìm user theo email
        let user = await User.findOne({
            where: { email },
        });

        // 3. Nếu chưa có → tạo user Google
        if (!user) {
            user = await User.create({
                google_id: sub,
                name,
                email,
                password: "GOOGLE_LOGIN",
                phone: "0000000000",
            });
        }

        // 4. Tạo JWT
        const accessToken = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            user,
            accessToken,
        });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Google login failed" });
    }
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, phone, password, confirmPass } = req.body;

        // hash password 
        const saltRounds = 10; // thuong dung tu 10 - 12 (độ phức tạp của mã hóa)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        })

        const userRespone = await User.findByPk(newUser.id);
        res.status(201).json({ message: "User registered successfully", user: userRespone });

    } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
            const messages = err.errors.map((e) => ({
                msg: e.message,
                param: e.path,
            }));
            return res.status(400).json({
                message: "Dữ liệu không hợp lệ",
                errors: messages,
            });
        }
        next(err);
    }
}


exports.login = async (req, res, next) => {
    try {
        const { emailOrPhone, password } = req.body;

        const user = await User.scope("withPassword").findOne({
            where: {
                [Sequelize.Op.or]: [
                    { email: emailOrPhone },
                    { phone: emailOrPhone }
                ]
            }
        })

        if (!user) {
            return res.status(401).json({ message: "thong tin dang nhap khong chinh xac !!!" })
        }

        // Không cho login password với user Google
        if (user.password === "GOOGLE_LOGIN") {
            return res.status(400).json({
                message: "Tài khoản này đăng nhập bằng Google",
            });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password)
        if (!isMatchPassword) {
            return res.status(401).json({ message: "thong tin dang nhap khong chinh xac !!!" })
        }

        const payload = {
            userId: user.id
        }

        const secretKey = process.env.JWT_SECRET;
        const expiresIn = process.env.JWT_EXPIRES || "1h";
        const token = jwt.sign(payload, secretKey, { expiresIn });


        res.json({
            message: "Login successful",
            accessToken: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            }
        })


    } catch (err) {
        next(err);
    }
}


exports.getMe = async (req, res, next) => {
    res.json({ user: req.user });
}