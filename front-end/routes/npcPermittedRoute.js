import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
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
    getOGEffectsConstraints,
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
import { exchangeOfGoldAndResources } from "../controllers/goldCoinController.js";
import { updateMarket } from "../controllers/marketController.js";

const router = new express.Router();

router.post("/ogeffadd", verifyToken, authorizeRoles("admin", "npc"), ogEffectAddition);
router.get("/oginv/:id", verifyToken, authorizeRoles("admin", "npc"), getOGInventory);
router.put("/ogdevland", verifyToken, authorizeRoles("admin", "npc"), developLand);
router.get("/oglands/:id", verifyToken, authorizeRoles("admin", "npc"), getOGLandOwned);
router.put("/ogtrain", verifyToken, authorizeRoles("admin", "npc"), trainArmy);
router.put("/oglndtrf", verifyToken, authorizeRoles("admin", "npc"), landTransfer);
router.put("/ogchglnd", verifyToken, authorizeRoles("admin", "npc"), changeLandProperty);
router.get("/oguseable-eff/:id", verifyToken, authorizeRoles("admin", "npc"), getAvailableUsableOGEffect);
router.put("/oguse-eff", verifyToken, authorizeRoles("admin", "npc"), useOGEffect);
router.get("/ogallcons/:id", verifyToken, authorizeRoles("admin", "npc"), getOGEffectsConstraints);
router.put("/goldexchg", verifyToken, authorizeRoles("admin", "npc"), exchangeOfGoldAndResources);
router.put("/market", verifyToken, authorizeRoles("admin", "npc"), updateMarket);

export default router;