import {
    addOGService,
    getOGService,
    updateOGService,
    getAllOGService,
    deleteOGService
} from "../models/ogTableService.js"

// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const addOG = async(req, res, next) => {
    const {name, score} = req.body;
    try 
    {
        const newOG = await addOGService(name, score);
        handleResponse(res, 201, "New OG added!", newOG);
    } catch(err)
    {
        next(err);
    }
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
    const {name, score} = req.body;
    try 
    {
        const updatedOG = await updateOGService(req.params.id, name, score);
        if (!updatedOG) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG details updated successfully!", updatedOG);
    } catch(err)
    {
        next(err);
    }
};

export const deleteOG = async(req, res, next) => {
    try 
    {
        const deletedOG = await deleteOGService(req.params.id);
        if (!deletedOG) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG deleted successfully!", deletedOG);
    } catch(err)
    {
        next(err);
    }
};