import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { 
    getSpecificFreelandService, 
    updateSpecificFreelandService 
} from "../models/freelandTableService.js";
import { 
    updateOGSpecificLandService 
} from "../models/landTableService.js";
import { 
    getOGResourcesService,
    updateOGResourcesService 
} from "../models/resourcesTableService.js";


export const developLand = async(req, res) => {
    const { ogID, resourcesChanges, landType} = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        const currentFreeland = await getSpecificFreelandService(client, landType);

        if (currentFreeland === 0)
        {
            throw new Error(`No more land of ${type} resource can be developed!`);
        } else 
        {
            await updateOGSpecificLandService(client, ogID, landType, 1);
            await updateSpecificFreelandService(client, landType, -1);
        }

        const currentResources = await getOGResourcesService(client, ogID);   

        if (!currentResources) 
        {
            throw new Error("Invalid OG ID, unable to pay.");
        }

        for (const [resourceType, changes] of Object.entries(resourcesChanges))
        {
            // Make Changes
            if (currentResources[resourceType] < changes)
            {
                throw new Error(`Insufficient resources: ${resourceType}`);
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
        handleResponse(res, 200, "Land developed and paid for successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to develop land: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};