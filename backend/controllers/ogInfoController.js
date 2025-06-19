import pool from "../config/db.js";
import { 
    getOGLandService 
} from "../models/landTableService.js";
import {
    getOGService
} from "../models/ogTableService.js";
import {
    getOGResourcesService,
    getAllOGResourcesSumService
} from "../models/resourcesTableService.js";
import {
    userGetAllOGNameScoreService
} from "../models/usersModel.js";

// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getOGResArm = async(req, res) => {
    const id = req.params.id || req.user.id;
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const resources = await getOGResourcesService(client, id);
        await client.query("COMMIT");
        let resarm;
        const ogDetails = await getOGService(client, id);
        resarm = {
            army: ogDetails.army,
            ...resources
        };
        handleResponse(res, 200, "OG Resources & Army fetched successfully!", resarm);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to fetch OG resources & army: ${err}`);
    } finally
    {
        client.release();
    }
};

export const getOGLandOwned = async(req, res) => {
    const id = req.params.id || req.user.id;
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const lands = await getOGLandService(client, id);
        await client.query("COMMIT");
        handleResponse(res, 200, "OG's developed land fetched successfully!", lands);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to fetch OG's developed land: ${err}`);
    } finally
    {
        client.release();
    }
};


export const getLeaderboard = async(req, res, next) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const leaderboard = await userGetAllOGNameScoreService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "Leaderboard fetched successfully!", leaderboard);
    } catch(err)
    {
        await client.query("ROLLBACK");
        next(err);
    } finally
    {
        client.release();
    }
};

export const getAllResourcesWithheld = async(req, res, next) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const resSum = await getAllOGResourcesSumService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "Total resources withheld fetched successfully!", resSum);
    } catch(err)
    {
        await client.query("ROLLBACK");
        next(err);
    } finally
    {
        client.release();
    }
};