import pool from "../config/db.js";

export const getOGWheelService = async(id) => {
    const result = await pool.query(
        "SELECT blank, wood, bricks, livestock, wheat, ore, textiles FROM land WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

export const getAllOGWheelService = async() => {
    const result = await pool.query(
        "SELECT * FROM wheel",
    );
    return result.rows;
};

export const updateOGBlankWheelService = async(id, blank) => {
    const result = await pool.query(
        "UPDATE wheel SET blank = $1 WHERE id = $2 RETURNING *",
        [blank, id]
    );
    return result.rows[0];
};