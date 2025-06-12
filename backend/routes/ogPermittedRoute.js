import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { 
    handleTrade,
    getAvailableOGs
} from "../controllers/ogTradeController.js";

const router = new express.Router();

router.post("/trade", verifyToken, authorizeRoles("og"), handleTrade);
router.get("/available-ogs", verifyToken, authorizeRoles("og"), getAvailableOGs);

export default router;