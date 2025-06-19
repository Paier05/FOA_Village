import pool from "../config/db.js";

const autoExpireInventory = async () => {
    const client = await pool.connect();
    try 
    {
        await client.query(`
            UPDATE inventory
            SET status = 0
            WHERE expiry IS NOT NULL 
              AND expiry < CURRENT_TIME 
              AND status = 1;
        `);
    } catch (err) 
    {
        console.error("[Inventory Expiry Job] Error:", err);
    } finally 
    {
        client.release();
    }
};

export default autoExpireInventory;