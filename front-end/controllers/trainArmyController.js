import pool from "../config/db.js";
import handleResponse, { RES_TRANSLATION } from "../middlewares/responseHandler.js";
import { 
    getOGArmyForUpdateService,
    updateOGArmyService 
} from "../models/ogTableService.js";
import { 
    getOGResourcesForUpdateService,
    updateOGResourcesService 
} from "../models/resourcesTableService.js";


export const trainArmy = async(req, res) => {
    const { ogID, resourcesChanges, armyAmount } = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        await getOGArmyForUpdateService(client, ogID);
        await updateOGArmyService(client, ogID, armyAmount);

        const currentResources = await getOGResourcesForUpdateService(client, ogID);   

        if (!currentResources) 
        {
            throw new Error("所提供的 OG Id 不存在，无法训练军队！");
        }

        for (const [resourceType, changes] of Object.entries(resourcesChanges))
        {
            // Make Changes
            if (currentResources[resourceType] < changes)
            {
                throw new Error(` ${RES_TRANSLATION[resourceType]} 资源不足！`);
            } else 
            {
                currentResources[resourceType] -= changes;
            }
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
        handleResponse(res, 200, "军队训练成功！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `军队训练失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};