import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { 
    getOG,
    getAllOG,
    updateOGScore,
    updateOGArmy,
    updateOGFDCX,
    updateOGFDCXPlus,
    updateOGMLMF,
    updateOGSMMF,
    updateOGSMMFPlus
} from "../controllers/ogController.js";

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
    "/ogs/:id/score",
    verifyToken,
    authorizeRoles("admin"),
    updateOGScore);

router.put(
    "/ogs/:id/army",
    verifyToken,
    authorizeRoles("admin"),
    updateOGArmy);

router.put(
    "/ogs/:id/fdcx",
    verifyToken,
    authorizeRoles("admin"),
    updateOGFDCX);

router.put(
    "/ogs/:id/fdcx_plus",
    verifyToken,
    authorizeRoles("admin"),
    updateOGFDCXPlus);

router.put(
    "/ogs/:id/mlmf",
    verifyToken,
    authorizeRoles("admin"),
    updateOGMLMF);

router.put(
    "/ogs/:id/smmf",
    verifyToken,
    authorizeRoles("admin"),
    updateOGSMMF);

router.put(
    "/ogs/:id/smmf_plus",
    verifyToken,
    authorizeRoles("admin"),
    updateOGSMMFPlus);

export default router;