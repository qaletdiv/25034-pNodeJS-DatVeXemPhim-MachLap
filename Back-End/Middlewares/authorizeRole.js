const authorizeRole = (allowedRoles) => {
  //chuyen allowedRoles thanh arrays
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    // Check if res.user and res.user.role exist?
    if (!req.user || !req.user.role) {
      console.error("Autherization eror : missing req.user or req.user.role");

      return res.status(403).json({
        message: "không thể xác địng vai trò người dùng để phân quyền !!",
      });
    }

    const userRole = req.user.role;

    // If the role is not on the list of allowed roles
    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập tài nguyên này !!" });
    }
    // If have role is next to step
    next();
  };
};

module.exports = authorizeRole;
