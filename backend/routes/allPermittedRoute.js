import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import {
    getGamePhase
} from "../controllers/gamePhaseController.js";
import { 
    getLeaderboard,
    getAllResourcesWithheld
} from "../controllers/ogInfoController.js";

const router = new express.Router();

router.get("/gamephase", verifyToken, authorizeRoles("admin", "npc", "moderator", "og"), getGamePhase);
router.get("/leaderboard", verifyToken, authorizeRoles("admin", "npc", "moderator", "og"), getLeaderboard);
router.get("/allreswithheld", verifyToken, authorizeRoles("admin", "npc", "moderator", "og"), getAllResourcesWithheld);

export default router;