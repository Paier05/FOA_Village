import express from "express";
import { 
    getAllFreeland,
    updateAllFreeland
} from "../controllers/freelandController.js";

const router = new express.Router();

router.get("/free", getAllFreeland);
router.put("/free", updateAllFreeland);

export default router;