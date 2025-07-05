export const getEventService = async(client) => {
    const result = await client.query(
        "SELECT event, expiry FROM events"
    );
    return result.rows[0];
};

export const updateEventService = async(client, event) => {
    const result = await client.query(
        "UPDATE events SET event = $1, expiry = CURRENT_TIME + (10 || ' minutes')::interval RETURNING *",
        [event]
    );
    return result.rows[0];
};

export const updateEventTimeService = async(client, time) => {
    const result = await client.query(
        "UPDATE events SET expiry = CURRENT_TIME + ($1 || ' minutes')::interval RETURNING *",
        [time]
    );
    return result.rows[0];
};