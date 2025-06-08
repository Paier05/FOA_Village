import {
    getOGLandService,
    updateOGLandService,
    getAllOGLandService
} from "../models/landTableService.js"

// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getOGLand = async(req, res, next) => {
    try 
    {
        const land = await getOGLandService(req.params.id);
        if (!land) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG resources fetched successfully!", land);
    } catch(err)
    {
        next(err);
    }
};

export const getAllOGLand = async(req, res, next) => {
    try
    {
        const allLand = await getAllOGLandService();
        handleResponse(res, 200, "All OG resources fetched successfully!", allLand);
    } catch(err)
    {
        next(err);
    }
};

export const updateOGLand = async(req, res, next) => {
    const {wood, bricks, livestock, wheat, ore, textiles} = req.body;
    try 
    {
        const updatedLand = await updateOGLandService(req.params.id, wood, bricks, livestock, wheat, ore, textiles);
        if (!updatedLand) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG details updated successfully!", updatedLand);
    } catch(err)
    {
        next(err);
    }
};