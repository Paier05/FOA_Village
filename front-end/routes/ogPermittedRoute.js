import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { 
    handleTrade,
    getAvailableOGs
} from "../controllers/ogTradeController.js";
import { 
    getOGEffectsConstraints,
    getOGLandOwned,
    getOGResArm
} from "../controllers/ogInfoController.js";
import { 
    getOGInventory 
} from "../controllers/getOGInventoryController.js";

const router = new express.Router();

router.post("/trade", verifyToken, authorizeRoles("admin", "og"), handleTrade);
router.get("/ogresarm", verifyToken, authorizeRoles("admin", "og"), getOGResArm);
router.get("/available-ogs", verifyToken, authorizeRoles("admin", "og"), getAvailableOGs);
router.get("/oginv", verifyToken, authorizeRoles("admin", "og"), getOGInventory);
router.get("/oglands", verifyToken, authorizeRoles("admin", "og"), getOGLandOwned);
router.get("/ogallcons", verifyToken, authorizeRoles("admin", "og"), getOGEffectsConstraints);

export default router;