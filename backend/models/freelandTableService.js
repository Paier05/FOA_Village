export const getAllFreelandService = async(client) => {
    const result = await client.query(
        "SELECT * FROM freeland",
    );
    return result.rows[0];
};

export const updateAllFreelandService = async(client, wood, bricks, livestock, wheat, ore, textiles) => {
    const result = await client.query(
        "UPDATE freeland SET wood = $1, bricks = $2, livestock = $3, wheat = $4, ore = $5, textiles = $6 RETURNING *",
        [wood, bricks, livestock, wheat, ore, textiles]
    );
    return result.rows[0];
};

export const getSpecificFreelandService = async(client, type) => {
    const result = await client.query(
        `SELECT ${type} FROM freeland FOR UPDATE`,
    );
    return result.rows[0]?.[type];
};

export const updateSpecificFreelandService = async(client, type, changes) => {
    const result = await client.query(
        `UPDATE freeland SET ${type} = ${type} + $1`,
        [changes]
    );
    return result.rows[0]?.[type];
};
