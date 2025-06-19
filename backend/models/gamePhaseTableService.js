export const getGamePhaseService = async(client) => {
    const result = await client.query(
        "SELECT phase, starttime FROM gamephase"
    );
    return result.rows[0];
};

export const updateGamePhaseService = async(client, phase) => {
    const result = await client.query(
        "UPDATE gamephase SET phase = $1, starttime = NOW() RETURNING *",
        [phase]
    );
    return result.rows[0];
};