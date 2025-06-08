import pool from "../config/db.js";

export const getOGService = async(id) => {
    const result = await pool.query(
        "SELECT score, army, fdcx, fdcx_plus, mlmf, smmf, smmf_plus FROM og WHERE id = $1",
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

export const updateOGScoreService = async(id, score) => {
    const result = await pool.query(
        "UPDATE og SET score = $1 WHERE id = $2 RETURNING *",
        [score, id]
    );
    return result.rows[0];
};

export const updateOGArmyService = async(id, army) => {
    const result = await pool.query(
        "UPDATE og SET army = $1 WHERE id = $2 RETURNING *",
        [army, id]
    );
    return result.rows[0];
};

export const updateOGFDCXService = async(id, fdcx) => {
    const result = await pool.query(
        "UPDATE og SET fdcx = $1 WHERE id = $2 RETURNING *",
        [fdcx, id]
    );
    return result.rows[0];
};

export const updateOGFDCXPlusService = async(id, fdcx_plus) => {
    const result = await pool.query(
        "UPDATE og SET fdcx_plus = $1 WHERE id = $2 RETURNING *",
        [fdcx_plus, id]
    );
    return result.rows[0];
};

export const updateOGMLMFService = async(id, mlmf) => {
    const result = await pool.query(
        "UPDATE og SET mlmf = $1 WHERE id = $2 RETURNING *",
        [mlmf, id]
    );
    return result.rows[0];
};

export const updateOGSMMFService = async(id, smmf) => {
    const result = await pool.query(
        "UPDATE og SET smmf = $1 WHERE id = $2 RETURNING *",
        [smmf, id]
    );
    return result.rows[0];
};

export const updateOGSMMFPlusService = async(id, smmf_plus) => {
    const result = await pool.query(
        "UPDATE og SET smmf_plus = $1 WHERE id = $2 RETURNING *",
        [smmf_plus, id]
    );
    return result.rows[0];
};