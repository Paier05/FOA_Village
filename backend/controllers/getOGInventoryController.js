import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { 
    getOGInventoryBuffService, 
    getOGInventoryDebuffService 
} from "../models/inventoryTableService.js";
import { 
    userGetNameByIDService 
} from "../models/usersModel.js";


export const getOGInventory = async(req, res) => {
    const id = req.params.id || req.user.id;
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const buffs = await getOGInventoryBuffService(client, id);
        const debuffs = await getOGInventoryDebuffService(client, id);

        const sgNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));
        const sgToday = sgNow.toISOString().split("T")[0];

        const processedBuffs = await Promise.all(buffs.map(async (buff) => {
            const targetName = await userGetNameByIDService(client, buff.target);
            return {
                effect: buff.effect,
                targetName,
                resource: buff.type,
                expiry: buff.expiry 
                    ? (() => {
                        const trimmedTime = buff.expiry.split(".")[0];
                        const utcDateString = `${sgToday}T${trimmedTime}Z`;
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
                        const trimmedTime = debuff.expiry.split(".")[0];
                        const utcDateString = `${sgToday}T${trimmedTime}Z`;
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
        handleResponse(res, 200, "OG 的特效库存已读取成功！", inventory);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `OG 的特效库存读取失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};