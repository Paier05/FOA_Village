import pool from "../config/db.js";

export const getOGLandService = async(id) => {
    const result = await pool.query(
        "SELECT wood, bricks, livestock, wheat, ore, textiles FROM land WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

export const getAllOGLandService = async() => {
    const result = await pool.query(
        "SELECT * FROM land",
    );
    return result.rows;
};

export const updateOGLandService = async(id, wood, bricks, livestock, wheat, ore, textiles) => {
    const result = await pool.query(
        "UPDATE land SET wood = $1, bricks = $2, livestock = $3, wheat = $4, ore = $5, textiles = $6 WHERE id = $7 RETURNING *",
        [wood, bricks, livestock, wheat, ore, textiles, id]
    );
    return result.rows[0];
};