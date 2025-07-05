export const getOGWheelService = async(client, id) => {
    const result = await client.query(
        "SELECT blank, wood, bricks, livestock, wheat, ore, textiles FROM wheel WHERE id = $1",
        [id]
    );
    return result.rows[0];
};


export const updateOGBlankWheelService = async(client, id, blank) => {
    const result = await client.query(
        "UPDATE wheel SET blank = $1 WHERE id = $2 RETURNING *",
        [blank, id]
    );
    return result.rows[0];
};