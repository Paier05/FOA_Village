import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { 
    getAllFreelandService, 
    updateAllFreelandService 
} from "../models/freelandTableService.js";
import { 
    addOGEffectService, 
    getExistingEffectService, 
    getExistingMerlinMagicService, 
    replaceExistingMerlinMagicService, 
    retimeExistingEffectService 
} from "../models/inventoryTableService.js";
import { 
    getOGLandService, 
    updateOGLandService 
} from "../models/landTableService.js";
import { getOGArmyService, getOGService, updateOGArmyService, updateSpecificEffectConstraintService } from "../models/ogTableService.js";
import { getOGResourcesService, updateOGResourcesService } from "../models/resourcesTableService.js";


// Force Set Gamephase Table
    // NO NEED

// Force Set Event Table
    // NO NEED

// Force Set Wheel Table
    // NO NEED

// Force Set Users Table
    // NO NEED

// Force Set Freeland Table
    // Add / Remove Freeland (NEW) -- DONE

// Force Set Inventory Table --> 
    // Grant Effects (NEW) -- DONE
    // Use Effect (SAME) -- DONE

// Force Set Land Table
    // Develop / Remove Land (NEW) -- DONE

// Force Set OG Table
    // Force set army amount (NEW) -- DONE
    // Force set effects constraints (NEW) -- DONE

// Force Set Resources Table
    // Give / Remove resources (NEW) -- DONE


// Force Set Free Land Amount
export const forceSetFreeland = async(req, res) => {
    const { freelandChanges } = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        const allFreeland = await getAllFreelandService(client);

        for (const [landType, changes] of Object.entries(freelandChanges))
        {
            if (changes < 0 && allFreeland[landType] < -1*changes)
            {
                throw new Error(`Insufficient free land type: ${landType}`);
            } else 
            {
                allFreeland[landType] += changes;
            }
        }

        await updateAllFreelandService(
            client,
            allFreeland.wood,
            allFreeland.bricks,
            allFreeland.livestock,
            allFreeland.wheat,
            allFreeland.ore,
            allFreeland.textiles            
        );

        await client.query("COMMIT");
        handleResponse(res, 200, "Freeland table updated successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to update free land table: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};


// Force Set OG Land Amount
// Won't affect freeland table
export const forceSetOGLand = async(req, res) => {
    const { ogID, landChanges} = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        const ogland = await getOGLandService(client, ogID);

        if (!ogland) 
        {
            throw new Error("Invalid OG ID, unable to make changes.");
        }

        for (const [landType, changes] of Object.entries(landChanges))
        {
            if (changes < 0 && ogland[landType] < -1*changes)
            {
                throw new Error(`Insufficient land type: ${landType}`);
            } else 
            {
                ogland[landType] += changes;
            }
        }

        await updateOGLandService(
            client,
            ogID,
            ogland.wood,
            ogland.bricks,
            ogland.livestock,
            ogland.wheat,
            ogland.ore,
            ogland.textiles
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


// Force Add Effects to Inventory
// Won't affect effects' constraints
export const forceSetEffectAddition = async(req, res) => {
    const { ogID, effect, targetID, type } = req.body;

    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");

        const existing = await getExistingEffectService(client, ogID, effect, targetID, type)
        if (effect === "釜底抽薪")
        {
            if (existing)
            {
                await retimeExistingEffectService(client, existing, 11);
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, 11);
            }

        } else if (effect === "釜底抽薪+")
        {
            if (existing)
            {
                await retimeExistingEffectService(client, existing, 11);
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, 11);
            }

        } else if (effect === "天道酬勤")
        {
            if (existing)
            {
                await retimeExistingEffectService(client, existing, 11);
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, 11);
            }

        } else if (effect === "天道酬勤+")
        {
            if (existing)
            {
                await retimeExistingEffectService(client, existing, 16);
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, 16);
            }

        } else if (effect === "梅林的魔法")
        {
            const existmlmf = await getExistingMerlinMagicService(client, ogID)
            if (existmlmf)
            {
                await replaceExistingMerlinMagicService(client, existmlmf, type);
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, 11);
            }

        } else if (effect === "防御工事" || effect === "石中剑" || effect === "知己知彼" || 
                effect === "兵不厌诈" || effect === "兵不厌诈+" || effect === "抛砖引玉" || 
                effect === "十面埋伏" || effect === "十面埋伏+")
        {
            await addOGEffectService(client, ogID, effect, targetID, type, null);
        } 

        await client.query("COMMIT");
        handleResponse(res, 200, "Special effect forcefully granted successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to grant effect: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};


// Force Set Resources
export const forceSetOGResources = async(req, res) => {
    const { ogID, resourcesChanges } = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");

        const currentResources = await getOGResourcesService(client, ogID);   

        if (!currentResources) 
        {
            throw new Error("Invalid OG ID, unable to make changes.");
        }

        for (const [resourceType, changes] of Object.entries(resourcesChanges))
        {
            if (changes < 0 && currentResources[resourceType] < -1*changes)
            {
                throw new Error(`Insufficient resources: ${resourceType}`);
            } else 
            {
                currentResources[resourceType] += changes;
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
        handleResponse(res, 200, "OG resources updated successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to update OG resources: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};


// Force set OG Army Amount
export const forceSetOGArmy = async(req, res) => {
    const { ogID, armyAmount } = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        const army = await getOGArmyService(client, ogID);

        if (armyAmount < 0 && army < -1*armyAmount)
        {
            throw new Error(`Insufficient army amount!`);
        } else 
        {
            await updateOGArmyService(client, ogID, armyAmount);
        }

        await client.query("COMMIT");
        handleResponse(res, 200, "Army amount updated successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to update army amount: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};


// Force set effects constraints
const CONSTRAINTS = {
    "釜底抽薪": "fdcx",
    "釜底抽薪+": "fdcx_plus",
    "梅林的魔法": "mlmf",
    "十面埋伏": "smmf",
    "十面埋伏+": "smmf_plus",
    "防御工事": "fygs",
    "石中剑": "szj",
    "抛砖引玉": "pzyy"
};
export const forceSetOGEffectConstraints = async(req, res) => {
    const { ogID, effect, changes } = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        const ogInfo = await getOGService(client, ogID);

        if (changes < 0 && ogInfo[CONSTRAINTS[effect]] < -1*changes)
        {
            throw new Error(`Insufficient constraint limit for ${effect}!`);
        } else 
        {
            await updateSpecificEffectConstraintService(client, ogID, CONSTRAINTS[effect], changes);
        }

        await client.query("COMMIT");
        handleResponse(res, 200, "Effect constraints updated successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to update effect constraints: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};
