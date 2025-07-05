export const getOGService = async(client, id) => {
    const result = await client.query(
        "SELECT score, army, fdcx, fdcx_plus, mlmf, smmf, fygs, szj, pzyy FROM og WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

export const getOGAllConstraintsService = async(client, id) => {
    const result = await client.query(
        "SELECT fdcx, fdcx_plus, mlmf, smmf, fygs, szj, pzyy FROM og WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

export const getOGForUpdateService = async(client, id) => {
    const result = await client.query(
        "SELECT score, army, fdcx, fdcx_plus, mlmf, smmf, fygs, szj, pzyy FROM og WHERE id = $1 FOR UPDATE",
        [id]
    );
    return result.rows[0];
};

export const getOGArmyForUpdateService = async(client, id) => {
    const result = await client.query(
        "SELECT army FROM og WHERE id = $1 FOR UPDATE",
        [id]
    );
    return result.rows[0]?.army;
};

export const updateOGArmyService = async(client, id, amount) => {
    const result = await client.query(
        "UPDATE og SET army = army + $1 WHERE id = $2 RETURNING *",
        [amount, id]
    );
    return result.rows[0];
};

export const getOGGoldService = async(client, id) => {
    const result = await client.query(
        "SELECT gold FROM og WHERE id = $1",
        [id]
    );
    return result.rows[0]?.gold;
};

export const getOGGoldForUpdateService = async(client, id) => {
    const result = await client.query(
        "SELECT gold FROM og WHERE id = $1 FOR UPDATE",
        [id]
    );
    return result.rows[0]?.gold;
};

export const updateOGGoldService = async(client, id, amount) => {
    const result = await client.query(
        "UPDATE og SET gold = gold + $1 WHERE id = $2 RETURNING *",
        [amount, id]
    );
    return result.rows[0];
};

export const deductOGFDCXService = async(client, id) => {
    const result = await client.query(
        "UPDATE og SET fdcx = fdcx - 1 WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

export const deductOGFDCXPlusService = async(client, id) => {
    const result = await client.query(
        "UPDATE og SET fdcx_plus = fdcx_plus - 1 WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

export const deductOGMLMFService = async(client, id) => {
    const result = await client.query(
        "UPDATE og SET mlmf = mlmf - 1 WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

export const deductOGSMMFService = async(client, id) => {
    const result = await client.query(
        "UPDATE og SET smmf = smmf - 1 WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

export const deductOGFYGSService = async(client, id) => {
    const result = await client.query(
        "UPDATE og SET fygs = fygs - 1 WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

export const deductOGSZJService = async(client, id) => {
    const result = await client.query(
        "UPDATE og SET szj = szj - 1 WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

export const deductOGPZYYService = async(client, id) => {
    const result = await client.query(
        "UPDATE og SET pzyy = pzyy - 1 WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

export const updateSpecificEffectConstraintService = async(client, id, effect, changes) => {
    const result = await client.query(
        `UPDATE og SET ${effect} = ${effect} + $1 WHERE id = $2 RETURNING *`,
        [changes, id]
    );
    return result.rows[0];
};


/*
export const getAllOGService = async(client) => {
    const result = await client.query(
        "SELECT * FROM og",
    );
    return result.rows;
};

export const getOGArmyService = async(client, id) => {
    const result = await client.query(
        "SELECT army FROM og WHERE id = $1",
        [id]
    );
    return result.rows[0]?.army;
};

export const resetArmyService = async(client) => {
    const result = await client.query(
        "UPDATE og SET army = 0 RETURNING *"
    );
    return result.rows;
};
*/