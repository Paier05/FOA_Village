export const getAllMarketService = async(client) => {
    const result = await client.query(
        "SELECT * FROM market",
    );
    return result.rows[0];
};

export const getAllMarketForUpdateService = async(client) => {
    const result = await client.query(
        "SELECT * FROM market FOR UPDATE",
    );
    return result.rows[0];
};

export const updateAllMarketService = async(client, wood, bricks, livestock, wheat, ore, textiles) => {
    const result = await client.query(
        "UPDATE market SET wood = $1, bricks = $2, livestock = $3, wheat = $4, ore = $5, textiles = $6 RETURNING *",
        [wood, bricks, livestock, wheat, ore, textiles]
    );
    return result.rows[0];
};