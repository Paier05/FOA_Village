import pool from "../config/db.js";
import { 
    updateOGArmyService 
} from "../models/ogTableService.js";
import { 
    getOGResourcesService, 
    updateOGResourcesService 
} from "../models/resourcesTableService.js";


// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const trainArmy = async(req, res) => {
    const { ogID, resourcesChanges, armyAmount } = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        await updateOGArmyService(client, ogID, armyAmount);

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
        handleResponse(res, 200, "Army trained successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to train army: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};