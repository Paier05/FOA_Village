import pool from "../config/db.js";
import handleResponse, { RES_TRANSLATION } from "../middlewares/responseHandler.js";
import { 
    getSpecificFreelandForUpdateService,
    updateSpecificFreelandService 
} from "../models/freelandTableService.js";
import { 
    getOGSpecificLandForUpdateService,
    updateOGSpecificLandService 
} from "../models/landTableService.js";
import { 
    getOGResourcesForUpdateService,
    updateOGResourcesService 
} from "../models/resourcesTableService.js";


export const developLand = async(req, res) => {
    const { ogID, resourcesChanges, landType} = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        const currentFreeland = await getSpecificFreelandForUpdateService(client, landType);

        if (currentFreeland === 0)
        {
            throw new Error(`所有 ${RES_TRANSLATION[landType]} 的产地都已被开发`);
        } else 
        {
            await getOGSpecificLandForUpdateService(client, ogID, landType);
            await updateOGSpecificLandService(client, ogID, landType, 1);
            await updateSpecificFreelandService(client, landType, -1);
        }

        const currentResources = await getOGResourcesForUpdateService(client, ogID);   

        if (!currentResources) 
        {
            throw new Error("所提供的 OG Id 不存在，无法开发产地！");
        }

        for (const [resourceType, changes] of Object.entries(resourcesChanges))
        {
            // Make Changes
            if (currentResources[resourceType] < changes)
            {
                throw new Error(`${RES_TRANSLATION[resourceType]} 资源不足！`);
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
        handleResponse(res, 200, "产地已成功被开发！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `产地开发失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};