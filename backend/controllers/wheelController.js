import {
    getOGWheelService,
    updateOGBlankWheelService,
    getAllOGWheelService
} from "../models/wheelTableService.js"

// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getOGWheel = async(req, res, next) => {
    try 
    {
        const wheel = await getOGWheelService(req.params.id);
        if (!wheel) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG wheel fetched successfully!", wheel);
    } catch(err)
    {
        next(err);
    }
};

export const getAllOGWheel = async(req, res, next) => {
    try
    {
        const allWheels = await getAllOGWheelService();
        handleResponse(res, 200, "All OG wheels fetched successfully!", allWheels);
    } catch(err)
    {
        next(err);
    }
};

export const updateOGBlankWheel = async(req, res, next) => {
    const {blank} = req.body;
    try 
    {
        const updatedBlank = await updateOGBlankWheelService(req.params.id, blank);
        if (!updatedBlank) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG wheel's blank slots amount updated successfully!", updatedBlank);
    } catch(err)
    {
        next(err);
    }
};