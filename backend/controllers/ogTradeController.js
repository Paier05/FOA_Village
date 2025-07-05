import pool from "../config/db.js";
import handleResponse, { RES_TRANSLATION } from "../middlewares/responseHandler.js";
import { 
    getOGResourcesForUpdateService,
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
        return handleResponse(res, 400, "所提供的交易负载有问题！");
    }

    const client = await pool.connect();

    try 
    {
        await client.query("BEGIN");

        const senderResources = await getOGResourcesForUpdateService(client, fromOgId);
        const receiverResources = await getOGResourcesForUpdateService(client, toOg);

        if (!senderResources || !receiverResources) 
        {
            throw new Error("所提供的 OG Id 不存在，无法进行交易！");
        }

        // Validate trade
        for (const [resourceType, amount] of Object.entries(resources)) 
        {
            if (amount < 0 || senderResources[resourceType] < amount) 
            {
                throw new Error(` ${RES_TRANSLATION[resourceType]} 资源不足！`);
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
        handleResponse(res, 200, "交易成功！");

    } catch (err) 
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `交易失败：${err.message || err}`);
    } finally 
    {
        client.release();
    }
};



export const getAvailableOGs = async (req, res) => 
{
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const currentUserId = req.user.id;
        const ogList = await userGetAvailableOGService(client, currentUserId);
        await client.query("COMMIT");
        handleResponse(res, 200, "成功读取所有 OG 名单！", ogList);
    } catch (err) 
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法读取所有 OG 名单：${err}`);
    } finally 
    {
        client.release();
    }
};