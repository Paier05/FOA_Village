import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { 
    ogResourcesDeduction 
} from "../controllers/addOGResourceController.js";
import { 
    ogEffectAddition 
} from "../controllers/effectsController.js";
import { 
    getOGInventory 
} from "../controllers/getOGInventoryController.js";
import { 
    developLand 
} from "../controllers/developLandController.js";
import { 
    getOGLandOwned 
} from "../controllers/ogInfoController.js";
import { 
    trainArmy 
} from "../controllers/trainArmyController.js";
import { 
    landTransfer 
} from "../controllers/transferLandController.js";
import { 
    changeLandProperty 
} from "../controllers/changeLandTypeController.js";
import { 
    getAvailableUsableOGEffect, 
    useOGEffect 
} from "../controllers/useEffectController.js";

const router = new express.Router();

router.put("/ogrespay", verifyToken, authorizeRoles("admin", "npc"), ogResourcesDeduction);
router.post("/ogeffadd", verifyToken, authorizeRoles("admin", "npc"), ogEffectAddition);
router.get("/oginv/:id", verifyToken, authorizeRoles("admin", "npc"), getOGInventory);
router.put("/ogdevland", verifyToken, authorizeRoles("admin", "npc"), developLand);
router.get("/oglands/:id", verifyToken, authorizeRoles("admin", "npc"), getOGLandOwned);
router.put("/ogtrain", verifyToken, authorizeRoles("admin", "npc"), trainArmy);
router.put("/oglndtrf", verifyToken, authorizeRoles("admin", "npc"), landTransfer);
router.put("/ogchglnd", verifyToken, authorizeRoles("admin", "npc"), changeLandProperty);
router.get("/oguseable-eff/:id", verifyToken, authorizeRoles("admin", "npc"), getAvailableUsableOGEffect);
router.put("/oguse-eff", verifyToken, authorizeRoles("admin", "npc"), useOGEffect);

export default router;