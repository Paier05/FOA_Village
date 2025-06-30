import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { 
    getOGResourcesService, 
    updateOGResourcesService 
} from "../models/resourcesTableService.js";
import {
    userGetAvailableOGService
} from "../models/usersModel.js";


export const handleTrade = async (req, res) => 
{
    const { toOg, resources } = req.body;
    const fromOgId = req.user.id;

    if (!toOg || typeof resources !== "object") 
    {
        return handleResponse(res, 400, "Invalid trade payload.");
    }

    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");

        const senderResources = await getOGResourcesService(client, fromOgId);
        const receiverResources = await getOGResourcesService(client, toOg);

        if (!senderResources || !receiverResources) 
        {
            throw new Error("Invalid OG ID(s).");
        }

        // Validate trade
        for (const [resourceType, amount] of Object.entries(resources)) 
        {
            if (!senderResources.hasOwnProperty(resourceType)) 
            {
                throw new Error(`Invalid resource: ${resourceType}`);
            }
            if (amount < 0 || senderResources[resourceType] < amount) 
            {
                throw new Error(`Insufficient ${resourceType}`);
            }
        }

        // Deduct from sender
        const newSender = { ...senderResources };
        for (const [resourceType, amount] of Object.entries(resources)) 
        {
            newSender[resourceType] -= amount;
        }

        await updateOGResourcesService(
            client,
            fromOgId,
            newSender.wood,
            newSender.bricks,
            newSender.livestock,
            newSender.wheat,
            newSender.ore,
            newSender.textiles
            );

        // Add to receiver
        const newReceiver = { ...receiverResources };
        for (const [resourceType, amount] of Object.entries(resources)) 
        {
            newReceiver[resourceType] += amount;
        }

        await updateOGResourcesService(
            client,
            toOg,
            newReceiver.wood,
            newReceiver.bricks,
            newReceiver.livestock,
            newReceiver.wheat,
            newReceiver.ore,
            newReceiver.textiles
            );

        await client.query("COMMIT");
        handleResponse(res, 200, "Trade successful!");

    } catch (err) 
    {
        await client.query("ROLLBACK");
        console.error("Trade error:", err);
        handleResponse(res, 400, `Trade failed: ${err.message}`);
    } finally 
    {
        client.release();
    }
};



export const getAvailableOGs = async (req, res, next) => 
{
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const currentUserId = req.user.id;
        const ogList = await userGetAvailableOGService(client, currentUserId);
        await client.query("COMMIT");
        handleResponse(res, 200, "Successfully retrieved available OGs for trading!", ogList);
    } catch (err) 
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to retrieve available OGs for trading: ${err}`);
    } finally 
    {
        client.release();
    }
};