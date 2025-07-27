import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import {
    getGamePhaseService,
    updateGamePhaseService,
    updateGamePhaseTimeService
} from "../models/gamePhaseTableService.js";
import { clearOGResourcesService } from "../models/resourcesTableService.js";


export const getGamePhase = async(req, res) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const gamephase = await getGamePhaseService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "现游戏阶段读取成功！", gamephase);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `现游戏阶段读取失败：${err}`);
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

        // Clear the resources table
        if (phase.endsWith("战争期"))
        {
            await clearOGResourcesService(client);
        }
        await client.query("COMMIT");
        handleResponse(res, 200, "现游戏阶段已修改成功！", updatedGamephase);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `现游戏阶段修改失败：${err}`);
    } finally
    {
        client.release();
    }
};

export const updateGamePhaseTime = async(req, res) => {
    const client = await pool.connect();
    const { time } = req.body;
    try 
    {
        await client.query("BEGIN");
        const updatedGamephaseTime = await updateGamePhaseTimeService(client, time);
        await client.query("COMMIT");
        handleResponse(res, 200, "现游戏阶段所剩时长已修改成功！", updatedGamephaseTime);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `现游戏阶段所剩时长修改失败：${err}`);
    } finally
    {
        client.release();
    }
};