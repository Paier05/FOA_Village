export const getOGResourcesService = async(client, id) => {
    const result = await client.query(
        "SELECT wood, bricks, livestock, wheat, ore, textiles FROM resources WHERE id = $1 FOR UPDATE",
        [id]
    );
    return result.rows[0];
};

export const getAllOGResourcesService = async(client) => {
    const result = await client.query(
        "SELECT * FROM resources",
    );
    return result.rows;
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

export const updateOGWoodService = async(client, id, wood) => {
    const result = await client.query(
        "UPDATE resources SET wood = $1 WHERE id = $2 RETURNING *",
        [wood, id]
    );
    return result.rows[0];
};

export const updateOGBricksService = async(client, id, bricks) => {
    const result = await client.query(
        "UPDATE resources SET bricks = $1 WHERE id = $2 RETURNING *",
        [bricks, id]
    );
    return result.rows[0];
};

export const updateOGLivestockService = async(client, id, livestock) => {
    const result = await client.query(
        "UPDATE resources SET livestock = $1 WHERE id = $2 RETURNING *",
        [livestock, id]
    );
    return result.rows[0];
};

export const updateOGWheatService = async(client, id, wheat) => {
    const result = await client.query(
        "UPDATE resources SET wheat = $1 WHERE id = $2 RETURNING *",
        [wheat, id]
    );
    return result.rows[0];
};

export const updateOGOreService = async(client, id, ore) => {
    const result = await client.query(
        "UPDATE resources SET ore = $1 WHERE id = $2 RETURNING *",
        [ore, id]
    );
    return result.rows[0];
};

export const updateOGTextilesService = async(client, id, textiles) => {
    const result = await client.query(
        "UPDATE resources SET textiles = $1 WHERE id = $2 RETURNING *",
        [textiles, id]
    );
    return result.rows[0];
};