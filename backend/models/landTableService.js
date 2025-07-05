export const getOGLandService = async(client, id) => {
    const result = await client.query(
        "SELECT wood, bricks, livestock, wheat, ore, textiles FROM land WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

export const getOGLandForUpdateService = async(client, id) => {
    const result = await client.query(
        "SELECT wood, bricks, livestock, wheat, ore, textiles FROM land WHERE id = $1 FOR UPDATE",
        [id]
    );
    return result.rows[0];
};


export const updateOGLandService = async(client, id, wood, bricks, livestock, wheat, ore, textiles) => {
    const result = await client.query(
        "UPDATE land SET wood = $1, bricks = $2, livestock = $3, wheat = $4, ore = $5, textiles = $6 WHERE id = $7 RETURNING *",
        [wood, bricks, livestock, wheat, ore, textiles, id]
    );
    return result.rows[0];
};


export const getOGSpecificLandForUpdateService = async(client, id, type) => {
    const result = await client.query(
        `SELECT ${type} FROM land WHERE id = $1 FOR UPDATE`,
        [id]
    );
    return result.rows[0]?.[type];
};

export const updateOGSpecificLandService = async(client, id, type, changes) => {
    const result = await client.query(
        `UPDATE land SET ${type} = ${type} + $1 WHERE id = $2 RETURNING *`,
        [changes, id]
    );
    return result.rows[0];
};

export const useSwordInStoneEffectService = async(client, id, oldType, newType) => {
    const result = await client.query(
        `UPDATE land SET ${oldType} = ${oldType} - 1, ${newType} = ${newType} + 1 WHERE id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0];
};

export const getTotalDevelopedLandService = async(client) => {
    const result = await client.query(
        "SELECT SUM(wood) AS wood, SUM(bricks) AS bricks, SUM(livestock) AS livestock, SUM(wheat) AS wheat, SUM(ore) AS ore, SUM(textiles) AS textiles FROM land"
    );
    return result.rows[0];
};

/*
export const getAllOGLandService = async(client) => {
    const result = await client.query(
        "SELECT * FROM land",
    );
    return result.rows;
};
*/