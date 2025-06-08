import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({   
            status: 401,
            message: "Access denied, no token provided!"
        });
    }

    try 
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("The decoded user is: ", req.user);
        next();
    } catch(err)
    {
        res.status(400).json({
            status: 400,
            message: "Token is invalid!"
        });
    }
};

export default verifyToken;