import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { 
    getEventService, 
    updateEventService
} from "../models/eventsTableService.js";


export const getEvent = async(req, res) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const event = await getEventService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "Event fetched successfully!", event);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to retrieve event: ${err}`);
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
        handleResponse(res, 200, `Event "${event}" started successfully!`);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to start event: ${phase}`, err);
    } finally
    {
        client.release();
    }
};

