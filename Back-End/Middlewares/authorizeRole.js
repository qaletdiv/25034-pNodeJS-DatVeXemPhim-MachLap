const authorizeRole = (allowedRoles) => {
    //chuyen allowedRoles thanh arrays
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    return (req, res, next) => {
        // kiem tra res.user res.user.role có tồn tại hay không
        if (!req.user || !req.user.role) {
            console.error("Autherization eror : thieu req.user hoac req.user.role");

            return res.status(403).json({ message: "không thể xác địng vai trò người dùng để phân quyền !!" });
        }

        const userRole = req.user.role;

        // Nếu role không nằm trong dang sách allowedRoles
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: "Ban khong co quyen truy cap tai nguyen nay !!" });
        }
        // neu co quyen thi di tiep
        next();
    }
}

module.exports = authorizeRole;