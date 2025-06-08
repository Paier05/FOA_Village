import {
    getOGService,
    updateOGService,
    getAllOGService
} from "../models/ogTableService.js"

// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getOG = async(req, res, next) => {
    try 
    {
        const OG = await getOGService(req.params.id);
        if (!OG) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG details fetched successfully!", OG);
    } catch(err)
    {
        next(err);
    }
};

export const getAllOG = async(req, res, next) => {
    try
    {
        const OGs = await getAllOGService();
        handleResponse(res, 200, "All OG details fetched successfully!", OGs);
    } catch(err)
    {
        next(err);
    }
};

export const updateOG = async(req, res, next) => {
    const {score} = req.body;
    try 
    {
        const updatedOG = await updateOGService(req.params.id, score);
        if (!updatedOG) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG details updated successfully!", updatedOG);
    } catch(err)
    {
        next(err);
    }
};