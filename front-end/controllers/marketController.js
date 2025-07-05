import pool from "../config/db.js";
import handleResponse, { RES_TRANSLATION } from "../middlewares/responseHandler.js";
import { getAllMarketForUpdateService, getAllMarketService, updateAllMarketService } from "../models/marketTableService.js";


export const getMarket = async(req, res) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const market = await getAllMarketService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "资源市场读取成功！", market);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法读取资源市场资料: ${err}`);
    } finally
    {
        client.release();
    }
};


export const updateMarket = async(req, res) => {
    const { marketChanges } = req.body;
    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");
        const market = await getAllMarketForUpdateService(client);

        for (const [resourceType, changes] of Object.entries(marketChanges))
        {
            if (changes < 0 && market[resourceType] < -1*changes)
            {
                throw new Error(`市场的 ${RES_TRANSLATION[resourceType]} 与黄金的兑换率不足！`);
            } else 
            {
                market[resourceType] += changes;
            }
        }

        await updateAllMarketService(
            client,
            market.wood,
            market.bricks,
            market.livestock,
            market.wheat,
            market.ore,
            market.textiles            
        );

        await client.query("COMMIT");
        handleResponse(res, 200, "市场的资源与黄金的兑换率已修改！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `市场的资源与黄金的兑换修改失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};
