import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { 
    updateGamePhase,
    updateGamePhaseTime
} from "../controllers/gamePhaseController.js";
import { 
    getAllAccounts, 
    promoteAccount, 
    validateAccount 
} from "../controllers/manageAccountsController.js";
import { 
    updateEvent, 
    updateEventTime
} from "../controllers/eventsController.js";
import { forceSetEffectAddition, forceSetFreeland, forceSetOGArmy, forceSetOGEffectConstraints, forceSetOGLand, forceSetOGResources } from "../controllers/forceSetTableController.js";
import { getTotalDevelopedLand } from "../controllers/ogInfoController.js";
import { register } from "../controllers/authController.js";

const router = new express.Router();

router.post("/gamephase", verifyToken, authorizeRoles("admin"), updateGamePhase);
router.put("/gamephasetime", verifyToken, authorizeRoles("admin"), updateGamePhaseTime);
router.put("/events", verifyToken, authorizeRoles("admin"), updateEvent);
router.put("/eventstime", verifyToken, authorizeRoles("admin"), updateEventTime);
router.get("/totaldevlands", verifyToken, authorizeRoles("admin"), getTotalDevelopedLand);

router.put("/accounts/validation", verifyToken, authorizeRoles("admin"), validateAccount);
router.put("/accounts/promotion", verifyToken, authorizeRoles("admin"), promoteAccount);
router.get("/accounts/retrieval", verifyToken, authorizeRoles("admin"), getAllAccounts);
router.post("/accounts/register", verifyToken, authorizeRoles("admin"), register);

router.post("/forceset/addeffs", verifyToken, authorizeRoles("admin"), forceSetEffectAddition);
router.put("/forceset/freeland", verifyToken, authorizeRoles("admin"), forceSetFreeland);
router.put("/forceset/ogarmy", verifyToken, authorizeRoles("admin"), forceSetOGArmy);
router.put("/forceset/ogland", verifyToken, authorizeRoles("admin"), forceSetOGLand);
router.put("/forceset/ogres", verifyToken, authorizeRoles("admin"), forceSetOGResources);
router.put("/forceset/effcons", verifyToken, authorizeRoles("admin"), forceSetOGEffectConstraints);

export default router;