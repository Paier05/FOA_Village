import pool from "../config/db.js";

export const userRegisterService = async(name, password) => {
    const result = await pool.query(
        "INSERT INTO users (name, password, role) VALUES ($1, $2, 'og') RETURNING *",
        [name, password]
    );
    return result.rows[0];
};

export const userFindByNameService = async(name) => {
    const result = await pool.query(
        "SELECT id, name, password, role, valid FROM users WHERE name = $1",
        [name]
    );
    return result.rows[0];
};

export const userGetIDByNameService = async(client, name) => {
    const result = await client.query(
        "SELECT id FROM users WHERE name = $1",
        [name]
    );
    return result.rows[0]?.id;
};

export const userGetAvailableOGService = async(client, currentID) => {
    const result = await client.query(
        "SELECT id, name FROM users WHERE id != $1 AND role = 'og' AND valid = 1" ,
        [currentID]
    );
    return result.rows;
};