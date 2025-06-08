import pool from "../config/db.js";

export const getAllFreelandService = async() => {
    const result = await pool.query(
        "SELECT * FROM freeland",
    );
    return result.rows;
};

export const updateAllFreelandService = async(wood, bricks, livestock, wheat, ore, textiles) => {
    const result = await pool.query(
        "UPDATE freeland SET wood = $1, bricks = $2, livestock = $3, wheat = $4, ore = $5, textiles = $6 RETURNING *",
        [wood, bricks, livestock, wheat, ore, textiles]
    );
    return result.rows[0];
};