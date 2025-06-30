import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { 
    getOGSpecificLandService, 
    useSwordInStoneEffectService 
} from "../models/landTableService.js";


export const changeLandProperty = async(req, res) => {
    const { ogID, oldType, newType} = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        const currentOld = await getOGSpecificLandService(client, ogID, oldType);

        if (currentOld === 0)
        {
            throw new Error(`Insufficient land of ${oldType} resource!`);
        } else 
        {
            await useSwordInStoneEffectService(client, ogID, oldType, newType);
        }

        await client.query("COMMIT");
        handleResponse(res, 200, "Land property changed successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to change land property: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};