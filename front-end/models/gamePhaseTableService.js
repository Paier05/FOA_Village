const PHASE_DURATIONS = {
    "1st 发展期": 45,
    "1st 缓冲时间": 5,
    "1st 战争期": 15,
    "2nd 发展期": 45,
    "2nd 缓冲时间": 5,
    "2nd 战争期": 15
};

export const getGamePhaseService = async(client) => {
    const result = await client.query(
        "SELECT phase, endtime FROM gamephase"
    );
    return result.rows[0];
};

export const updateGamePhaseService = async(client, phase) => {
    const result = await client.query(
        `UPDATE gamephase SET phase = $1, endtime = CURRENT_TIME + (${PHASE_DURATIONS[phase]} || ' minutes')::interval RETURNING *`,
        [phase]
    );
    return result.rows[0];
};

export const updateGamePhaseTimeService = async(client, time) => {
    const result = await client.query(
        "UPDATE gamephase SET endtime = CURRENT_TIME + ($1 || ' minutes')::interval RETURNING *",
        [time]
    );
    return result.rows[0];
};