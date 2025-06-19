import pool from "../config/db.js";
import { 
    addOGEffectService,
    getExistingEffectService,
    retimeExistingEffectService,
    getExistingMerlinMagicService,
    replaceExistingMerlinMagicService
} from "../models/inventoryTableService.js";
import { 
    getOGService,
    deductOGFDCXService,
    deductOGFDCXPlusService,
    deductOGMLMFService,
    deductOGSMMFService,
    deductOGSMMFPlusService,
    deductOGFYGSService,
    deductOGSZJService,
    deductOGPZYYService,
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

export const ogEffectAddition = async(req, res) => {
    const { ogID, effect, targetID, type, resourcesChanges } = req.body;

    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const ownerLimit = await getOGService(client, ogID);
        const targetLimit = await getOGService(client, targetID);
        const existing = await getExistingEffectService(client, ogID, effect, targetID, type)
        if (effect === "釜底抽薪")
        {
            if (targetLimit["fdcx"] == 0)
            {
                throw new Error("Victim OG cannot be targetted again!");
            } else if (existing)
            {
                await retimeExistingEffectService(client, existing, 11);
                await deductOGFDCXService(client, targetID);
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, 11);
                await deductOGFDCXService(client, targetID);
            }

        } else if (effect === "釜底抽薪+")
        {
            if (targetLimit["fdcx_plus"] == 0)
            {
                throw new Error("Victim OG cannot be targetted again!");
            } else if (existing)
            {
                await retimeExistingEffectService(client, existing, 11);
                await deductOGFDCXPlusService(client, targetID);
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, 11);
                await deductOGFDCXPlusService(client, targetID);
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
            if (ownerLimit["mlmf"] == 0)
            {
                throw new Error("梅林的魔法 usage limit reached!");
            } else if (existmlmf)
            {
                await replaceExistingMerlinMagicService(client, existmlmf, type);
                await deductOGMLMFService(client, ogID);
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, 11);
                await deductOGMLMFService(client, ogID);
            }

        } else if (effect === "防御工事")
        {
            if (ownerLimit["fygs"] == 0)
            {
                throw new Error("防御工事 usage limit reached!");
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, null);
                await deductOGFYGSService(client, ogID);
            }

        } else if (effect === "石中剑")
        {
            if (ownerLimit["szj"] == 0)
            {
                throw new Error("石中剑 usage limit reached!");
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, null);
                await deductOGSZJService(client, ogID);
            }

        } else if (effect === "知己知彼" || effect === "兵不厌诈" || effect === "兵不厌诈+")
        {
            await addOGEffectService(client, ogID, effect, targetID, type, null);

        } else if (effect === "抛砖引玉")
        {
            if (ownerLimit["pzyy"] == 0)
            {
                throw new Error("抛砖引玉 acquiring limit reached!");
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, null);
                await deductOGPZYYService(client, ogID);
            }

        } else if (effect === "十面埋伏")
        {
            if (ownerLimit["smmf"] == 0)
            {
                throw new Error("十面埋伏 acquiring limit reached!");
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, null);
                await deductOGSMMFService(client, targetID);
            }

        } else if (effect === "十面埋伏+")
        {
            if (ownerLimit["smmf_plus"] == 0)
            {
                throw new Error("十面埋伏 + acquiring limit reached!");
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, null);
                await deductOGSMMFPlusService(client, targetID);
            }
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
        handleResponse(res, 200, "Special effect granted and paid for successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to pay for effect: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};