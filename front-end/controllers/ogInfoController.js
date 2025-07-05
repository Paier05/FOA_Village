import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { 
    getAllFreelandService 
} from "../models/freelandTableService.js";
import { 
    getOGLandService, 
    getTotalDevelopedLandService
} from "../models/landTableService.js";
import {
    getOGAllConstraintsService,
    getOGGoldService,
    getOGService
} from "../models/ogTableService.js";
import {
    getOGResourcesService,
    getAllOGResourcesSumService
} from "../models/resourcesTableService.js";
import {
    userGetAllOGNameScoreService
} from "../models/usersModel.js";


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
        const coins = await getOGGoldService(client, id);
        resarm = {
            gold: coins,
            army: ogDetails.army,
            ...resources
        };
        handleResponse(res, 200, "OG 的资源与军队库存已读取!", resarm);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `OG 的资源与军队库存读取失败: ${err}`);
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
        handleResponse(res, 200, "OG 的已开发产地资讯已读取！", lands);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `OG 的已开发产地资讯读取失败: ${err}`);
    } finally
    {
        client.release();
    }
};


export const getLeaderboard = async(req, res) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const leaderboard = await userGetAllOGNameScoreService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "排行榜已成功读取！", leaderboard);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法读取排行榜: ${err}`);
    } finally
    {
        client.release();
    }
};

export const getAllResourcesWithheld = async(req, res) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const resSum = await getAllOGResourcesSumService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "场上 OG 总资源持有量已读取成功！", resSum);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法读取场上 OG 总资源持有量: ${err}`);
    } finally
    {
        client.release();
    }
};

export const getFreeLandLeft = async(req, res) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const freelands = await getAllFreelandService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "未开发产地资讯已读取成功！", freelands);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法读取未开发产地资讯: ${err}`);
    } finally
    {
        client.release();
    }
};

export const getTotalDevelopedLand = async(req, res) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const developedLand = await getTotalDevelopedLandService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "场上总产地已开发量已读取成功！", developedLand);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法读取场上总产地已开发量: ${err}`);
    } finally
    {
        client.release();
    }
};

export const getOGEffectsConstraints = async(req, res) => {
    const id = req.params.id || req.user.id;
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const constraints = await getOGAllConstraintsService(client, id);
        await client.query("COMMIT");
        handleResponse(res, 200, "OG 的特殊技能上限资料读取成功！", constraints);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法读取OG 的特殊技能上限资料: ${err}`);
    } finally
    {
        client.release();
    }
};