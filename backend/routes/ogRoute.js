import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { 
    getOG,
    getAllOG,
    updateOG
} from "../controllers/ogController.js";

/*
const router = new express.Router();

router.get("/ogs", getAllOG);
router.get("/ogs/:id", getOG);
router.put("/ogs/:id", updateOG);

export default router;
*/

const router = new express.Router();

router.get(
    "/ogs", 
    verifyToken,
    authorizeRoles("admin", "og"),
    getAllOG);

router.get(
    "/ogs/:id",
    verifyToken,
    authorizeRoles("admin", "og"),
    getOG);

router.put(
    "/ogs/:id",
    verifyToken,
    authorizeRoles("admin"),
    updateOG);

export default router;