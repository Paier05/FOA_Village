import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { 
    addOGEffectService,
    retimeExistingEffectService,
    replaceExistingMerlinMagicService,
    getExistingEffectForUpdateService,
    getExistingMerlinMagicForUpdateService
} from "../models/inventoryTableService.js";
import { 
    deductOGFDCXService,
    deductOGFDCXPlusService,
    deductOGMLMFService,
    deductOGSMMFService,
    deductOGFYGSService,
    deductOGSZJService,
    deductOGPZYYService,
    getOGForUpdateService,
    getOGGoldForUpdateService,
    updateOGGoldService,
} from "../models/ogTableService.js";


export const ogEffectAddition = async(req, res) => {
    const { ogID, effect, targetID, type, goldAmount } = req.body;

    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const ownerLimit = await getOGForUpdateService(client, ogID);
        const targetLimit = await getOGForUpdateService(client, targetID);
        const existing = await getExistingEffectForUpdateService(client, ogID, effect, targetID, type)
        if (effect === "釜底抽薪")
        {
            if (targetLimit["fdcx"] == 0)
            {
                throw new Error("选择的 OG 已不能再被 釜底抽薪 针对！");
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
                throw new Error("选择的 OG 已不能再被 釜底抽薪+ 针对！");
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
                await retimeExistingEffectService(client, existing, 16);
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, 16);
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
            if (ownerLimit["mlmf"] == 0)
            {
                throw new Error(" 梅林的魔法 使用次数上限已至，不能再使用！");
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
                throw new Error(" 防御工事 使用次数上限已至，不能再使用！");
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, null);
                await deductOGFYGSService(client, ogID);
            }

        } else if (effect === "石中剑")
        {
            if (ownerLimit["szj"] == 0)
            {
                throw new Error(" 石中剑 使用次数上限已至，不能再使用！");
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, null);
                await deductOGSZJService(client, ogID);
            }

        } else if (effect === "知己知彼" || effect === "兵不厌诈")
        {
            await addOGEffectService(client, ogID, effect, targetID, type, null);

        } else if (effect === "抛砖引玉")
        {
            if (ownerLimit["pzyy"] == 0)
            {
                throw new Error(" 抛砖引玉 使用次数上限已至，不能再使用！");
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, null);
                await deductOGPZYYService(client, ogID);
            }

        } else if (effect === "十面埋伏")
        {
            if (ownerLimit["smmf"] == 0)
            {
                throw new Error(" 十面埋伏 使用次数上限已至，不能再使用！");
            } else
            {
                await addOGEffectService(client, ogID, effect, targetID, type, null);
                await deductOGSMMFService(client, targetID);
            }

        }

        const currentGold = await getOGGoldForUpdateService(client, ogID);
        
        if (!currentGold) 
        {
            throw new Error("所提供的 OG Id 不存在，无法支付特效！");
        }

        if (currentGold < goldAmount)
        {
            throw new Error(`金币不足！`);
        } else 
        {
            await updateOGGoldService(client, ogID, -1*goldAmount);
        }

        await client.query("COMMIT");
        handleResponse(res, 200, "特效支付成功！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `特效支付失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};