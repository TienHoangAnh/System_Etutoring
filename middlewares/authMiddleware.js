const jwt = require('jsonwebtoken');

const verifyRole = (roles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header
            if (!token) {
                return res.status(403).json({ message: 'Không có quyền truy cập!' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
            }

            req.user = decoded; // Gán user vào request
            next();
        } catch (error) {
            res.status(401).json({ message: 'Xác thực thất bại!' });
        }
    };
};

module.exports = verifyRole;
