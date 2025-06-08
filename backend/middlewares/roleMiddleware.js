const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 403,
                message: "Access denied!"
            });
        }
        next();
    };
};

export default authorizeRoles;