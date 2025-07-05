import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { 
    getExistingEffectForUseService, 
    getOGInventoryUsableEffectService, 
    useExistingEffectService 
} from "../models/inventoryTableService.js";


export const useOGEffect = async(req, res) => {
    const { effect_id } = req.body;

    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const effect = await getExistingEffectForUseService(client, effect_id);
        if (!effect)
        {
            throw new Error("特殊技能不存在！");
        }
        if (effect.status === 0) 
        {
            throw new Error("特殊技能之前已经被使用！");
        }
        await useExistingEffectService(client, effect_id);
        await client.query("COMMIT");
        handleResponse(res, 200, "特殊技能使用成功！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `特殊技能使用失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};

export const getAvailableUsableOGEffect = async(req, res) => {
    const ogID = req.params.id;
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const effects = await getOGInventoryUsableEffectService(client, ogID);
        await client.query("COMMIT");
        handleResponse(res, 200, "可使用的特殊技能资料读取成功！", effects);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `可使用的特殊技能资料读取失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};