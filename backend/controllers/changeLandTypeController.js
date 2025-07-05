import pool from "../config/db.js";
import handleResponse, { RES_TRANSLATION } from "../middlewares/responseHandler.js";
import { 
    getOGSpecificLandForUpdateService,
    useSwordInStoneEffectService 
} from "../models/landTableService.js";


export const changeLandProperty = async(req, res) => {
    const { ogID, oldType, newType} = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        const currentOld = await getOGSpecificLandForUpdateService(client, ogID, oldType);

        if (currentOld === 0)
        {
            throw new Error(`您的 ${RES_TRANSLATION[oldType]} 产地数量不足！`);
        } else 
        {
            await useSwordInStoneEffectService(client, ogID, oldType, newType);
        }

        await client.query("COMMIT");
        handleResponse(res, 200, `已将 ${RES_TRANSLATION[oldType]} 产地变成 ${RES_TRANSLATION[newType]} 产地！`);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法改变产地属性：${err.message || err}`);
    } finally
    {
        client.release();
    }
};