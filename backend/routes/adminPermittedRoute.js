import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { 
    updateGamePhase
} from "../controllers/gamePhaseController.js";
import { 
    getAllAccounts, 
    promoteAccount, 
    validateAccount 
} from "../controllers/manageAccountsController.js";

const router = new express.Router();

router.post("/gamephase", verifyToken, authorizeRoles("admin"), updateGamePhase);
router.put("/accounts/validation", verifyToken, authorizeRoles("admin"), validateAccount);
router.put("/accounts/promotion", verifyToken, authorizeRoles("admin"), promoteAccount);
router.get("/accounts/retrieval", verifyToken, authorizeRoles("admin"), getAllAccounts);

export default router;