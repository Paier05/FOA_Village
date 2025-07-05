import pool from "../config/db.js";
import handleResponse from "../middlewares/responseHandler.js";
import { 
    getAccountForUpdateService,
    getAllAccountsService, 
    promoteUserService, 
    validateUserService 
} from "../models/usersModel.js";


export const getAllAccounts = async(req, res) => {
    const client = await pool.connect();
    try 
    {
        await client.query("BEGIN");
        const accounts = await getAllAccountsService(client);
        await client.query("COMMIT");
        handleResponse(res, 200, "所有账号资料读取成功！", accounts);
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `无法读取所有账号资料：${err.message || err}`);
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
        await getAccountForUpdateService(client, id);
        await promoteUserService(client, id, role);
        await client.query("COMMIT");
        handleResponse(res, 200, "账号权限已成功修改！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `账号权限修改失败：${err.message || err}`);
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
        await getAccountForUpdateService(client, id);
        await validateUserService(client, id, validity);
        await client.query("COMMIT");
        handleResponse(res, 200, "账号成功被启动！");
    } catch(err)
    {
        await client.query("ROLLBACK");
        handleResponse(res, 400, `账号启动失败：${err.message || err}`);
    } finally
    {
        client.release();
    }
};