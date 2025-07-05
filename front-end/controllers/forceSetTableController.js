import pool from "../config/db.js";
import handleResponse, { RES_TRANSLATION } from "../middlewares/responseHandler.js";
import { 
    getAllFreelandForUpdateService,
    updateAllFreelandService 
} from "../models/freelandTableService.js";
import { 
    addOGEffectService, 
    getExistingEffectForUpdateService, 
    getExistingMerlinMagicForUpdateService, 
    replaceExistingMerlinMagicService, 
    retimeExistingEffectService 
} from "../models/inventoryTableService.js";
import { 
    getOGLandForUpdateService,
    updateOGLandService 
} from "../models/landTableService.js";
import { 
    getOGArmyForUpdateService,
    getOGForUpdateService, 
    updateOGArmyService, 
    updateSpecificEffectConstraintService 
} from "../models/ogTableService.js";
import { 
    getOGResourcesForUpdateService,
    updateOGResourcesService 
} from "../models/resourcesTableService.js";


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
        const allFreeland = await getAllFreelandForUpdateService(client);

        for (const [landType, changes] of Object.entries(freelandChanges))
        {
            if (changes < 0 && allFreeland[landType] < -1*changes)
            {
                throw new Error(`未开发的 ${RES_TRANSLATION[landType]} 产地数量不足！`);
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
        handleResponse(res, 200, "未开发产地的数量已强制被修改！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `未开发产地的数量强制被修改失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};


// Force Set OG Land Amount
// Won't affect freeland table
export const forceSetOGLand = async(req, res) => {
    const { ogID, landChanges } = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        const ogland = await getOGLandForUpdateService(client, ogID);

        if (!ogland) 
        {
            throw new Error("所提供的 OG Id 不存在，无法修改产地资料！");
        }

        for (const [landType, changes] of Object.entries(landChanges))
        {
            if (changes < 0 && ogland[landType] < -1*changes)
            {
                throw new Error(` ${RES_TRANSLATION[landType]} 产地不足！`);
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
        handleResponse(res, 200, "产地资料已被强制修改成功！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `产地资料被强制修改失败：${err.message || err}`);
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

        const existing = await getExistingEffectForUpdateService(client, ogID, effect, targetID, type)
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
            const existmlmf = await getExistingMerlinMagicForUpdateService(client, ogID)
            if (existmlmf)
            {
                await replaceExistingMerlinMagicService(client, existmlmf, type);
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, 11);
            }

        } else if (effect === "防御工事" || effect === "石中剑" || effect === "知己知彼" || 
                effect === "兵不厌诈" || effect === "抛砖引玉" || effect === "十面埋伏")
        {
            await addOGEffectService(client, ogID, effect, targetID, type, null);
        } 

        await client.query("COMMIT");
        handleResponse(res, 200, "特效资料已强制被修改！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `特效资料强制修改失败：${err.message || err}`);
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

        const currentResources = await getOGResourcesForUpdateService(client, ogID);   

        if (!currentResources) 
        {
            throw new Error("所提供的 OG Id 不存在，无法修改资源数量！");
        }

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
        handleResponse(res, 200, "OG 的资源数量已成功被修改！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `OG 的资源数量修改失败：${err.message || err}`);
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
        const army = await getOGArmyForUpdateService(client, ogID);

        if (armyAmount < 0 && army < -1*armyAmount)
        {
            throw new Error(`军队数量不足！`);
        } else 
        {
            await updateOGArmyService(client, ogID, armyAmount);
        }

        await client.query("COMMIT");
        handleResponse(res, 200, "军队数量已成功被修改！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `军队数量修改失败：${err.message || err}`);
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
        const ogInfo = await getOGForUpdateService(client, ogID);

        if (changes < 0 && ogInfo[CONSTRAINTS[effect]] < -1*changes)
        {
            throw new Error(` ${effect} 特效的上限次数不足！`);
        } else 
        {
            await updateSpecificEffectConstraintService(client, ogID, CONSTRAINTS[effect], changes);
        }

        await client.query("COMMIT");
        handleResponse(res, 200, "特效的上限已修改成功！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `特效的上限修改失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};
