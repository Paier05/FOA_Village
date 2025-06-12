import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    userRegisterService,
    userFindByNameService
} from "../models/usersModel.js";

// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const register = async(req, res, next) => {
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try 
    {
        const newUser = await userRegisterService(username, hashedPassword);
        handleResponse(res, 200, "New OG registered successfully!\nWaiting for admin's approval, this may take some time...", newUser);
    } catch(err)
    {
        next(err);
    }
};

export const login = async(req, res, next) => {
    const {username, password} = req.body;
    try 
    {
        const user = await userFindByNameService(username);
        if (!user) return handleResponse(res, 404, "Not Found!");
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return handleResponse(res, 400, "Invalid credentials!");
        if (user.valid === 0) return handleResponse(res, 400, "User account is not yet approved by admin!");

        const token = jwt.sign(
            {id: user.id, role: user.role},
            process.env.JWT_SECRET  ,
            {expiresIn: "1h"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true in production (when using HTTPS)
            sameSite: "lax", // Or "strict", depending on your needs
            maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
        });

        handleResponse(
            res, 200, "Logged in Successfully!", 
            {
                id: user.id,
                username: user.name,
                role: user.role
            }
        );

    } catch(err)
    {
        next(err);
    }
};
