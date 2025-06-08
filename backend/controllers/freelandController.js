import {
    updateAllFreelandService,
    getAllFreelandService
} from "../models/freelandTableService.js"

// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getAllFreeland = async(req, res, next) => {
    try
    {
        const freeland = await getAllFreelandService();
        handleResponse(res, 200, "All undominated land availability fetched successfully!", freeland);
    } catch(err)
    {
        next(err);
    }
};

export const updateAllFreeland = async(req, res, next) => {
    const {wood, bricks, livestock, wheat, ore, textiles} = req.body;
    try 
    {
        const updatedLand = await updateAllFreelandService(wood, bricks, livestock, wheat, ore, textiles);
        if (!updatedLand) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "Undominated land availability updated successfully!", updatedLand);
    } catch(err)
    {
        next(err);
    }
};