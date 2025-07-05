import express from "express";
import {
    login,
    logout
} from "../controllers/authController.js";

const router = new express.Router();

router.post("/login", login);
router.post("/logout", logout);

export default router;