import pool from "../config/db.js";
import { 
    getOGLandService, 
    updateOGLandService 
} from "../models/landTableService.js";


// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const landTransfer = async(req, res) => {
    const { winnerID, loserID, landChanges } = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        
        const loserLands = await getOGLandService(client, loserID);
        const winnerLands = await getOGLandService(client, winnerID);   

        if (!loserLands || !winnerLands) 
        {
            throw new Error("Invalid OG ID, unable to initiate land transfer.");
        }

        for (const [landType, changes] of Object.entries(landChanges))
        {
            // Make Changes
            if (loserLands[landType] < changes)
            {
                throw new Error(`Insufficient land type: ${landType}`);
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
        handleResponse(res, 200, "Land transfered successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to transfer land: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};