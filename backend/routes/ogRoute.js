import express from "express";
import { 
    getOG,
    addOG,
    getAllOG,
    updateOG,
    deleteOG
} from "../controllers/ogController.js";

const router = new express.Router();

router.post("/ogs", addOG);
router.get("/ogs", getAllOG);
router.get("/ogs/:id", getOG);
router.put("/ogs/:id", updateOG);
router.delete("/ogs/:id", deleteOG);

export default router;