import pool from "../config/db.js";
import handleResponse, { RES_TRANSLATION } from "../middlewares/responseHandler.js";
import { 
    getOGLandForUpdateService, 
    updateOGLandService 
} from "../models/landTableService.js";


export const landTransfer = async(req, res) => {
    const { winnerID, loserID, landChanges } = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        
        const loserLands = await getOGLandForUpdateService(client, loserID);
        const winnerLands = await getOGLandForUpdateService(client, winnerID);   

        if (!loserLands || !winnerLands) 
        {
            throw new Error("所提供的 OG Id 不存在，无法进行产地转移！");
        }

        for (const [landType, changes] of Object.entries(landChanges))
        {
            // Make Changes
            if (loserLands[landType] < changes)
            {
                throw new Error(` ${RES_TRANSLATION[landType]} 产地不足！`);
            } else 
            {
                loserLands[landType] -= changes;
                winnerLands[landType] += changes;
            }
        }

        await updateOGLandService(
            client,
            loserID,
            loserLands.wood,
            loserLands.bricks,
            loserLands.livestock,
            loserLands.wheat,
            loserLands.ore,
            loserLands.textiles
        );

        await updateOGLandService(
            client,
            winnerID,
            winnerLands.wood,
            winnerLands.bricks,
            winnerLands.livestock,
            winnerLands.wheat,
            winnerLands.ore,
            winnerLands.textiles
        );

        await client.query("COMMIT");
        handleResponse(res, 200, "产地已成功被转移！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `产地转移失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};