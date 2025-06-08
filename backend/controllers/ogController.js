import {
    getOGService,
    updateOGScoreService,
    updateOGArmyService,
    updateOGFDCXService,
    updateOGFDCXPlusService,
    updateOGMLMFService,
    updateOGSMMFService,
    updateOGSMMFPlusService,
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

export const updateOGScore = async(req, res, next) => {
    const {score} = req.body;
    try 
    {
        const updatedOG = await updateOGScoreService(req.params.id, score);
        if (!updatedOG) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG score updated successfully!", updatedOG);
    } catch(err)
    {
        next(err);
    }
};

export const updateOGArmy = async(req, res, next) => {
    const {army} = req.body;
    try 
    {
        const updatedOG = await updateOGArmyService(req.params.id, army);
        if (!updatedOG) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG army updated successfully!", updatedOG);
    } catch(err)
    {
        next(err);
    }
};

export const updateOGFDCX = async(req, res, next) => {
    const {fdcx} = req.body;
    try 
    {
        const updatedOG = await updateOGFDCXService(req.params.id, fdcx);
        if (!updatedOG) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG fdcx updated successfully!", updatedOG);
    } catch(err)
    {
        next(err);
    }
};

export const updateOGFDCXPlus = async(req, res, next) => {
    const {fdcx_plus} = req.body;
    try 
    {
        const updatedOG = await updateOGFDCXPlusService(req.params.id, fdcx_plus);
        if (!updatedOG) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG fdcx_plus updated successfully!", updatedOG);
    } catch(err)
    {
        next(err);
    }
};

export const updateOGMLMF = async(req, res, next) => {
    const {mlmf} = req.body;
    try 
    {
        const updatedOG = await updateOGMLMFService(req.params.id, mlmf);
        if (!updatedOG) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG mlmf updated successfully!", updatedOG);
    } catch(err)
    {
        next(err);
    }
};

export const updateOGSMMF = async(req, res, next) => {
    const {smmf} = req.body;
    try 
    {
        const updatedOG = await updateOGSMMFService(req.params.id, smmf);
        if (!updatedOG) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG smmf updated successfully!", updatedOG);
    } catch(err)
    {
        next(err);
    }
};

export const updateOGSMMFPlus = async(req, res, next) => {
    const {smmf_plus} = req.body;
    try 
    {
        const updatedOG = await updateOGSMMFPlusService(req.params.id, smmf_plus);
        if (!updatedOG) return handleResponse(res, 404, "Not Found!");
        handleResponse(res, 200, "OG smmf_plus updated successfully!", updatedOG);
    } catch(err)
    {
        next(err);
    }
};
