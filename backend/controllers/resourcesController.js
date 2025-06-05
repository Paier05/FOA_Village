import {
    getOGResourcesService,
    updateOGResourcesService,
    getAllOGResourcesService
} from "../models/resourcesTableService.js"

// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getOGResources = async(req, res, next) => {
    try 
    {
        const resource = await getOGResourcesService(req.params.id);
        if (!resource) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG resources fetched successfully!", resource);
    } catch(err)
    {
        next(err);
    }
};

export const getAllOGResources = async(req, res, next) => {
    try
    {
        const allResources = await getAllOGResourcesService();
        handleResponse(res, 200, "All OG resources fetched successfully!", allResources);
    } catch(err)
    {
        next(err);
    }
};

export const updateOGResources = async(req, res, next) => {
    const {wood, bricks, livestock, wheat, ore, textiles} = req.body;
    try 
    {
        const updatedResource = await updateOGResourcesService(req.params.id, wood, bricks, livestock, wheat, ore, textiles);
        if (!updatedResource) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG details updated successfully!", updatedResource);
    } catch(err)
    {
        next(err);
    }
};