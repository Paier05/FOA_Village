import pool from "../config/db.js";
import { 
    getOGInventoryBuffService, 
    getOGInventoryDebuffService 
} from "../models/inventoryTableService.js";
import { 
    userGetNameByIDService 
} from "../models/usersModel.js";


// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getOGInventory = async(req, res) => {
    const id = req.params.id || req.user.id;
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const buffs = await getOGInventoryBuffService(client, id);
        const debuffs = await getOGInventoryDebuffService(client, id);

        const processedBuffs = await Promise.all(buffs.map(async (buff) => {
            const targetName = await userGetNameByIDService(client, buff.target);
            return {
                effect: buff.effect,
                targetName,
                resource: buff.type,
                expiry: buff.expiry 
                    ? (() => {
                        const today = new Date().toISOString().split("T")[0];
                        const trimmedTime = buff.expiry.split(".")[0]; // remove microseconds
                        const utcDateString = `${today}T${trimmedTime}Z`; // treat as UTC
                        const localTime = new Date(utcDateString);
                        return localTime.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: true });
                        })()
                    : null
            };
        }));

        const processedDebuffs = debuffs.map((debuff) => {
            return {
                effect: debuff.effect,
                resource: debuff.type,
                expiry: debuff.expiry 
                    ? (() => {
                        const today = new Date().toISOString().split("T")[0];
                        const trimmedTime = debuff.expiry.split(".")[0]; // remove microseconds
                        const utcDateString = `${today}T${trimmedTime}Z`; // treat as UTC
                        const localTime = new Date(utcDateString);
                        return localTime.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: true });
                        })()
                    : null
            };
        });
        await client.query("COMMIT");

        const inventory = {
            buffs: processedBuffs,
            debuffs: processedDebuffs
        }
        handleResponse(res, 200, "OG inventory fetched successfully!", inventory);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to fetch OG inventory: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};