import express from "express";
import { 
    getAllOGResources,
    getOGResources,
    updateOGResources
} from "../controllers/resourcesController.js";

const router = new express.Router();

router.get("/rsrc", getAllOGResources);
router.get("/rsrc/:id", getOGResources);
router.put("/rsrc/:id", updateOGResources);

export default router;