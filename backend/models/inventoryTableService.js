//釜底抽薪 & 釜底抽薪 +
export const getDebuffPerpetratorIDService = async(client, effect, target, type) => {
    const result = await client.query(
        "SELECT id FROM inventory WHERE effect = $1 AND target = $2 AND type = $3 AND status = 1",
        [effect, target, type]
    );
    return result.rows[0]?.id;
};

export const getMerlinMagicDetailsService = async(client, owner) => {
    const result = await client.query(
        "SELECT type FROM inventory WHERE id = $1 AND effect = '梅林的魔法' AND status = 1",
        [owner]
    );
    return result.rows[0]?.type;
};

export const getExistingEffectService = async(client, owner, effect, target, type) => {
    const result = await client.query(
        "SELECT effect_id FROM inventory WHERE id = $1 AND effect = $2 AND target = $3 AND type = $4 AND status = 1 FOR UPDATE",
        [owner, effect, target, type]
    );
    return result.rows[0]?.effect_id;
};

export const getExistingMerlinMagicService = async(client, owner) => {
    const result = await client.query(
        "SELECT effect_id FROM inventory WHERE id = $1 AND effect = '梅林的魔法' AND status = 1 FOR UPDATE",
        [owner]
    );
    return result.rows[0]?.effect_id;
};

export const retimeExistingEffectService = async(client, effect_id, duration) => {
    const result = await client.query(
        "UPDATE inventory SET expiry = CURRENT_TIME + ($1 || ' minutes')::interval, status = 1 WHERE effect_id = $2 RETURNING *",
        [duration, effect_id]
    );
    return result.rows[0];
};

export const replaceExistingMerlinMagicService = async(client, effect_id, type) => {
    const result = await client.query(
        "UPDATE inventory SET type = $1, expiry = CURRENT_TIME + (11 || ' minutes')::interval, status = 1 WHERE effect_id = $2 RETURNING *",
        [type, effect_id]
    );
    return result.rows[0];
};

export const addOGEffectService = async(client, owner, effect, target, type, duration) => {
    const result = await client.query(
        "INSERT INTO inventory (id, effect, target, type, expiry) VALUES ($1, $2, $3, $4, CURRENT_TIME + ($5 || ' minutes')::interval) RETURNING *",
        [owner, effect, target, type, duration]
    );
    return result.rows[0];
};

export const getOGInventoryBuffService = async(client, owner) => {
    const result = await client.query(
        "SELECT * FROM inventory WHERE id = $1 AND status = 1",
        [owner]
    );
    return result.rows;
};

export const getOGInventoryDebuffService = async(client, owner) => {
    const result = await client.query(
        "SELECT * FROM inventory WHERE (effect = '釜底抽薪' OR effect = '釜底抽薪+') AND target = $1 AND status = 1",
        [owner]
    );
    return result.rows;
};

export const clearInventoryTableService = async(client) => {
    const result = await client.query(
        "TRUNCATE TABLE inventory"
    );
    return result.rows;
};

export const getOGInventoryUsableEffectService = async (client, owner) => {
    const excludedEffects = [
        '釜底抽薪',
        '釜底抽薪+',
        '天道酬勤',
        '天道酬勤+',
        '梅林的魔法',
        '防御工事',
        '抛砖引玉'
    ];
    const result = await client.query(
        `SELECT effect_id, effect 
         FROM inventory 
         WHERE id = $1 
           AND effect NOT IN (${excludedEffects.map((_, i) => `$${i + 2}`).join(", ")}) 
           AND status = 1`,
        [owner, ...excludedEffects]
    );
    return result.rows;
};

export const useExistingEffectService = async(client, effect_id) => {
    const result = await client.query(
        "UPDATE inventory SET status = 0 WHERE effect_id = $1 RETURNING *",
        [effect_id]
    );
    return result.rows[0];
};


export const getExistingEffectForUseService = async(client, effect_id) => {
    const result = await client.query(
        "SELECT * FROM inventory WHERE effect_id = $1 FOR UPDATE",
        [effect_id]
    );
    return result.rows[0];
};