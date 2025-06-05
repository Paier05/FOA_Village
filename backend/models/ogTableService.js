import pool from "../config/db.js";

export const addOGService = async(name, score) => {
    const result = await pool.query(
        "INSERT INTO og (name, score) VALUES ($1, $2) RETURNING *",
        [name, score]
    );
    return result.rows[0];
};

export const getOGService = async(id) => {
    const result = await pool.query(
        "SELECT name, score FROM og WHERE id = $1",
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

export const updateOGService = async(id, name, score) => {
    const result = await pool.query(
        "UPDATE og SET name = $1, score = $2 WHERE id = $3 RETURNING *",
        [name, score, id]
    );
    return result.rows[0];
};

export const deleteOGService = async(id) => {
    const result = await pool.query(
        "DELETE FROM og WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0]
}