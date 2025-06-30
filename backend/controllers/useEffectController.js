import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { getExistingEffectForUseService, getOGInventoryUsableEffectService, useExistingEffectService } from "../models/inventoryTableService.js";


export const useOGEffect = async(req, res) => {
    const { effect_id } = req.body;

    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const effect = await getExistingEffectForUseService(client, effect_id);
        if (!effect)
        {
            throw new Error("Effect not found.");
        }
        if (effect.status === 0) 
        {
            throw new Error("Effect already used.");
        }
        await useExistingEffectService(client, effect_id);
        await client.query("COMMIT");
        handleResponse(res, 200, "Effect used successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to remove the effect: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};

export const getAvailableUsableOGEffect = async(req, res) => {
    const ogID = req.params.id;

    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const effects = await getOGInventoryUsableEffectService(client, ogID);
        await client.query("COMMIT");
        handleResponse(res, 200, "Useable effects fetched successfully!", effects);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to fetch useable effects: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};