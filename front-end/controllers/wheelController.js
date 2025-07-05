import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { getOGWheelService } from "../models/wheelTableService.js";

const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const getOGWheel = async(req, res) => {
    const id = req.params.id
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const wheel = await getOGWheelService(client, id);
        await client.query("COMMIT");

        const slotList = [];
        for (const type in wheel) {
            const count = wheel[type];
            for (let i = 0; i < count; i++) {
                slotList.push(type);
            }
        }
        const shuffledSlots = shuffleArray(slotList);

        handleResponse(res, 200, "OG 轮盘读取成功！", shuffledSlots);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `OG 轮盘读取失败：${err}`);
    } finally
    {
        client.release();
    }
};

export const spinOGWheel = async(req, res) => {
    const { wheel } = req.body;
    const client = await pool.connect();
    try 
    {
        if (!wheel || !Array.isArray(wheel) || wheel.length === 0) {
            throw new Error("所提供的 OG 轮盘格式不对/有问题！");
        }
        const randomIndex = Math.floor(Math.random() * wheel.length);
        const result = wheel[randomIndex];
        handleResponse(res, 200, `OG 轮盘旋转成功！`, result);
    } catch(err)
    {
        handleResponse(res, 400, `OG 轮盘旋转失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};