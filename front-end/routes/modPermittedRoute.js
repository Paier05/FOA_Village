import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import {
    ogResourcesAddition,
    getAllOGs
} from "../controllers/addOGResourceController.js";
import { 
    getOGResArm
} from "../controllers/ogInfoController.js";
import { getOGWheel, spinOGWheel } from "../controllers/wheelController.js";


const router = new express.Router();

router.put("/ogresadd", verifyToken, authorizeRoles("admin", "moderator"), ogResourcesAddition);
router.get("/wheelslots/:id", verifyToken, authorizeRoles("admin", "moderator"), getOGWheel);
router.post("/wheelspin", verifyToken, authorizeRoles("admin", "moderator"), spinOGWheel);

// BOTH NPC AND MODERATOR CAN ACCESS
router.get("/ogresarm/:id", verifyToken, authorizeRoles("admin", "moderator", "npc"), getOGResArm);
router.get("/all-ogs", verifyToken, authorizeRoles("admin", "moderator", "npc"), getAllOGs);

export default router;