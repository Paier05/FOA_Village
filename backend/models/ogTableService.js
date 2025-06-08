import pool from "../config/db.js";

export const getOGService = async(id) => {
    const result = await pool.query(
        "SELECT score FROM og WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

export const getAllOGService = async() => {
    const result = await pool.query(
        "SELECT * FROM og",
    );
    return result.rows;
};

export const updateOGService = async(id, score) => {
    const result = await pool.query(
        "UPDATE og SET score = $1 WHERE id = $2 RETURNING *",
        [score, id]
    );
    return result.rows[0];
};