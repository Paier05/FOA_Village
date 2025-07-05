import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { getOGGoldForUpdateService, updateOGGoldService } from "../models/ogTableService.js";
import { getOGResourcesForUpdateService, updateOGResourcesService } from "../models/resourcesTableService.js";

export const exchangeOfGoldAndResources = async(req, res) => {
    const { ogID, resourcesChanges, goldChanges } = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        const currentResources = await getOGResourcesForUpdateService(client, ogID);   

        if (!currentResources) 
        {
            throw new Error("所提供的 OG Id 不存在，无法训练军队！");
        }

        const currentGold = await getOGGoldForUpdateService(client, ogID);

        for (const [resourceType, changes] of Object.entries(resourcesChanges))
        {
            if (changes < 0 && currentResources[resourceType] < -1*changes)
            {
                throw new Error(` ${RES_TRANSLATION[resourceType]} 资源不足！`);
            } else 
            {
                currentResources[resourceType] += changes;
            }
        }

        if (goldChanges < 0 && currentGold < -1*goldChanges)
        {
            throw new Error(`金币不足！`);
        } else 
        {
            await updateOGGoldService(client, ogID, goldChanges);
        }

        await updateOGResourcesService(
            client,
            ogID,
            currentResources.wood,
            currentResources.bricks,
            currentResources.livestock,
            currentResources.wheat,
            currentResources.ore,
            currentResources.textiles
        );

        await client.query("COMMIT");
        handleResponse(res, 200, "金币与资源兑换成功！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `金币与资源兑换失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};