export const getOGResourcesService = async(client, id) => {
    const result = await client.query(
        "SELECT wood, bricks, livestock, wheat, ore, textiles FROM resources WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

export const getOGResourcesForUpdateService = async(client, id) => {
    const result = await client.query(
        "SELECT wood, bricks, livestock, wheat, ore, textiles FROM resources WHERE id = $1 FOR UPDATE",
        [id]
    );
    return result.rows[0];
};

export const getAllOGResourcesSumService = async(client) => {
    const result = await client.query(
        `SELECT 
            SUM(wood) AS wood, 
            SUM(bricks) AS bricks,
            SUM(livestock) AS livestock,
            SUM(wheat) AS wheat,
            SUM(ore) AS ore,
            SUM(textiles) AS textiles
        FROM resources`,
    );
    return result.rows[0];
};

export const updateOGResourcesService = async(client, id, wood, bricks, livestock, wheat, ore, textiles) => {
    const result = await client.query(
        "UPDATE resources SET wood = $1, bricks = $2, livestock = $3, wheat = $4, ore = $5, textiles = $6 WHERE id = $7 RETURNING *",
        [wood, bricks, livestock, wheat, ore, textiles, id]
    );
    return result.rows[0];
};

export const updateOGSpecificResourceService = async(client, id, resource, changes) => {
    const result = await client.query(
        `UPDATE resources SET ${resource} = ${resource} + $1 WHERE id = $2 RETURNING *`,
        [changes, id]
    );
    return result.rows[0];
};

export const clearOGResourcesService = async(client) => {
    const result = await client.query(
        "UPDATE resources SET wood = 0, bricks = 0, livestock = 0, wheat = 0, ore = 0, textiles = 0 RETURNING *"
    );
    return result.rows;
};