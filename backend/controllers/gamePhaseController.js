import pool from "../config/db.js";
import {
    getGamePhaseService,
    updateGamePhaseService
} from "../models/gamePhaseTableService.js";
import { 
    clearInventoryTableService 
} from "../models/inventoryTableService.js";
import { 
    resetArmyService 
} from "../models/ogTableService.js";

// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getGamePhase = async(req, res) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const gamephase = await getGamePhaseService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "Game phase data fetched successfully!", gamephase);
    } catch(err)
    {
        await client.query("ROLLBACK");
        next(err);
    } finally
    {
        client.release();
    }
};

export const updateGamePhase = async(req, res) => {
    const client = await pool.connect();
    const { phase } = req.body;
    try 
    {
        await client.query("BEGIN");
        const updatedGamephase = await updateGamePhaseService(client, phase);

        // Clear the inventory table
        if (phase.endsWith("Development Phase"))
        {
            await clearInventoryTableService(client);
            await resetArmyService(client);
        }
        await client.query("COMMIT");
        handleResponse(res, 200, "Game phase details updated successfully!", updatedGamephase);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to start phase: ${phase}`, err);
    } finally
    {
        client.release();
    }
};

