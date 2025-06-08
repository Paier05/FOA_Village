import express from "express";
import { 
    getAllOGWheel,
    getOGWheel,
    updateOGBlankWheel
} from "../controllers/wheelController.js";

const router = new express.Router();

router.get("/whl", getAllOGWheel);
router.get("/whl/:id", getOGWheel);
router.put("/whl/:id", updateOGBlankWheel);

export default router;