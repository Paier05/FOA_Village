import pool from "../config/db.js";
import { 
    getAllAccountsService, 
    promoteUserService, 
    validateUserService 
} from "../models/usersModel.js";

// Standardized Response Function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const getAllAccounts = async(req, res) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const accounts = await getAllAccountsService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "Accounts retrieved successfully!", accounts);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to retrieve accounts: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};

export const promoteAccount = async(req, res) => {
    const { id, role } = req.body;
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        await promoteUserService(client, id, role);
        await client.query("COMMIT");
        handleResponse(res, 200, "Account promoted successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to promote account: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};

export const validateAccount = async(req, res) => {
    const { id, validity } = req.body;
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        await validateUserService(client, id, validity);
        await client.query("COMMIT");
        handleResponse(res, 200, "Account activated successfully!");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `Failed to validate account: ${err.message || err}`);
    } finally
    {
        client.release();
    }
};