import pool from "../config/db.js";
import {
    getOGResourcesService,
    updateOGResourcesService,
    updateOGWoodService,
    updateOGBricksService,
    updateOGLivestockService,
    updateOGWheatService,
    updateOGOreService,
    updateOGTextilesService
} from "../models/resourcesTableService.js";
import {
    getDebuffPerpetratorIDService,
    getMerlinMagicDetailsService
} from "../models/inventoryTableService.js";
import {
    userGetAllOGService
} from "../models/usersModel.js";
import handleResponse from "../middlewares/responseHandler.js";
import { getEventService } from "../models/eventsTableService.js";

const EVENTS = {
    "干旱": { resource: "wheat", type: 0 },
    "丰收时期": { resource: "wheat", type: 2 },
    "瘟疫蔓延": { resource: "livestock", type: 0 },
    "畜牧繁荣": { resource: "livestock", type: 2 },
    "森林失火": { resource: "wood", type: 0 },
    "伐木盛年": { resource: "wood", type: 2 },
    "矿井坍塌": { resource: "bricks", type: 0 },
    "富矿突现": { resource: "bricks", type: 2 },
    "王室修城令": { resource: "ore", type: 0 },
    "千锤百炼": { resource: "ore", type: 2 },
    "蛾灾肆虐": { resource: "textiles", type: 0 },
    "织女降凡": { resource: "textiles", type: 2 }
};

export const ogResourcesAddition = async(req, res, next) => {
    const { ogID, resourcesChanges } = req.body;

    if (!ogID || typeof resourcesChanges !== "object") 
    {
        return handleResponse(res, 400, "Invalid trade payload!");
    }

    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");

        const currentResources = await getOGResourcesService(client, ogID);

        if (!currentResources) 
        {
            throw new Error("Invalid OG ID(s).");
        }
        
        // Check for 突发事件
        const event = await getEventService(client);
        const [h, m, s] = event.expiry.split(":").map(Number);
        const now = new Date();
        const expiryUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m, s));
        const remaining = Math.max(0, Math.floor((expiryUTC - now) / 1000));

        if (remaining > 0)
        {
            resourcesChanges[EVENTS[event.event].resource] *= EVENTS[event.event].type;
        }

        // Check for 天道酬勤 & 天道酬勤 + ---- 只有通过小游戏奖励获得的所有资源 x2
        const checktdcq = await getDebuffPerpetratorIDService(client, "天道酬勤", ogID, "others");
        const checktdcqp = await getDebuffPerpetratorIDService(client, "天道酬勤+", ogID, "others");

        // Check for 梅林的魔法 ---- 指定 1 资源，本 OG 所有产地产出的资源必会变成该资源
        const checkmlmf = await getMerlinMagicDetailsService(client, ogID);

        // Check for 防御工事 ---- 取消所有负面效果，且对负面效果免疫，石中剑除外
        const checkfygs = await getDebuffPerpetratorIDService(client, "防御工事", ogID, "others");

        for (const resourceType of Object.keys(resourcesChanges))
        {
            if (!checkfygs)
            {
                // Check for 釜底抽薪 ---- 指定 1 OG、1 资源，该 OG 无法获得此资源
                const checkfdcx = await getDebuffPerpetratorIDService(client, "釜底抽薪", ogID, resourceType);
                if (checkfdcx)
                {
                    resourcesChanges[resourceType] = 0;
                }

                // Check for 釜底抽薪 + ---- 指定 1 OG、1 资源，将该 OG 产出的此资源占为己有
                const checkfdcxp = await getDebuffPerpetratorIDService(client, "釜底抽薪+", ogID, resourceType);
                if (checkfdcxp)
                {
                    const originalResources = await getOGResourcesService(client, checkfdcxp);
                    if (resourceType === "wood")
                    {
                        await updateOGWoodService(client, checkfdcxp, originalResources[resourceType] + resourcesChanges[resourceType]);
                    } else if (resourceType === "bricks")
                    {
                        await updateOGBricksService(client, checkfdcxp, originalResources[resourceType] + resourcesChanges[resourceType]);
                    } else if (resourceType === "livestock")
                    {
                        await updateOGLivestockService(client, checkfdcxp, originalResources[resourceType] + resourcesChanges[resourceType]);
                    } else if (resourceType === "wheat")
                    {
                        await updateOGWheatService(client, checkfdcxp, originalResources[resourceType] + resourcesChanges[resourceType]);
                    } else if (resourceType === "ore")
                    {
                        await updateOGOreService(client, checkfdcxp, originalResources[resourceType] + resourcesChanges[resourceType]);
                    } else if (resourceType === "textiles")
                    {
                        await updateOGTextilesService(client, checkfdcxp, originalResources[resourceType] + resourcesChanges[resourceType]);
                    }
                    resourcesChanges[resourceType] = 0;
                }
            }

            if (checktdcq || checktdcqp)
            {
                resourcesChanges[resourceType] *= 2;
            }

            // Make Changes
            if (checkmlmf)
            {
                currentResources[checkmlmf] += resourcesChanges[resourceType];
            } else
            {
                currentResources[resourceType] += resourcesChanges[resourceType];
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

    } catch (err) 
    {
        await client.query("ROLLBACK");
        console.error("Error updating OG resources:", err);
        handleResponse(res, 400, "OG resources update failed!");
    } finally 
    {
        client.release();
    }
};


export const ogResourcesDeduction = async(req, res, next) => {
    const { ogID, resourcesChanges } = req.body;

    if (!ogID || typeof resourcesChanges !== "object") 
    {
        return handleResponse(res, 400, "Invalid trade payload!");
    }

    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");

        const currentResources = await getOGResourcesService(client, ogID);

        if (!currentResources) 
        {
            throw new Error("Invalid OG ID(s).");
        }

        for (const [resourceType, changes] of Object.entries(resourcesChanges))
        {
            // Make Changes
            if (currentResources[resourceType] < changes)
            {
                return handleResponse(res, 400, `Insufficient resources: ${resourceType}`);
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
        handleResponse(res, 200, "OG resources updated successfully!");

    } catch (err) 
    {
        await client.query("ROLLBACK");
        console.error("Error updating OG resources:", err);
        handleResponse(res, 400, "OG resources update failed!");
    } finally 
    {
        client.release();
    }
};


export const getAllOGs = async (req, res, next) => 
{
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const ogList = await userGetAllOGService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "OG list acquired successfully!", ogList);
    } catch (err) 
    {
        await client.query("ROLLBACK");
        next(err);
    } finally 
    {
        client.release();
    }
};