import express from "express";
import { 
    getAllOGLand,
    getOGLand,
    updateOGLand
} from "../controllers/landController.js";

const router = new express.Router();

router.get("/land", getAllOGLand);
router.get("/land/:id", getOGLand);
router.put("/land/:id", updateOGLand);

export default router;