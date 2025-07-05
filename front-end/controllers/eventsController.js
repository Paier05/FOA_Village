import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { 
    getEventService, 
    updateEventService,
    updateEventTimeService
} from "../models/eventsTableService.js";


export const getEvent = async(req, res) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const event = await getEventService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "突发事件已读取成功！", event);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法读取突发事件：${err}`);
    } finally
    {
        client.release();
    }
};

export const updateEvent = async(req, res) => {
    const client = await pool.connect();
    const { event } = req.body;
    try 
    {
        await client.query("BEGIN");
        await updateEventService(client, event);
        await client.query("COMMIT");
        handleResponse(res, 200, `突发事件 "${event}" 已成功被启动！`);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法启动突发事件：${err}`);
    } finally
    {
        client.release();
    }
};

export const updateEventTime = async(req, res) => {
    const client = await pool.connect();
    const { time } = req.body;
    try 
    {
        await client.query("BEGIN");
        await updateEventTimeService(client, time);
        await client.query("COMMIT");
        handleResponse(res, 200, `突发事件所剩时长已成功被修改！`);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法修改突发事件所剩时长：${err}`);
    } finally
    {
        client.release();
    }
};
