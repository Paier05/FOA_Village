export const userRegisterService = async(client, name, password) => {
    const result = await client.query(
        "INSERT INTO users (name, password, role) VALUES ($1, $2, 'og') RETURNING *",
        [name, password]
    );
    return result.rows[0];
};

export const userFindByNameService = async(client, name) => {
    const result = await client.query(
        "SELECT id, name, password, role, valid FROM users WHERE name = $1",
        [name]
    );
    return result.rows[0];
};

export const userGetIDByNameService = async(client, name) => {
    const result = await client.query(
        "SELECT id FROM users WHERE name = $1",
        [name]
    );
    return result.rows[0]?.id;
};

export const userGetNameByIDService = async(client, id) => {
    const result = await client.query(
        "SELECT name FROM users WHERE id = $1",
        [id]
    );
    return result.rows[0]?.name;
};

export const userGetAvailableOGService = async(client, currentID) => {
    const result = await client.query(
        "SELECT id, name FROM users WHERE id != $1 AND role = 'og' AND valid = 1" ,
        [currentID]
    );
    return result.rows;
};

export const userGetAllOGService = async(client) => {
    const result = await client.query(
        "SELECT id, name FROM users WHERE role = 'og' AND valid = 1" 
    );
    return result.rows;
};

export const userGetAllOGNameScoreService = async(client) => {
    const result = await client.query(
        "SELECT u.name, o.score FROM users u JOIN og o ON u.id = o.id WHERE u.valid = 1 ORDER BY o.score DESC" 
    );
    return result.rows;
};

export const validateUserService = async(client, id, validity) => {
    const result = await client.query(
        "UPDATE users SET valid = $1 WHERE id = $2 RETURNING *",
        [validity, id]
    );
    return result.rows[0];
};

export const promoteUserService = async(client, id, role) => {
    const result = await client.query(
        "UPDATE users SET role = $1 WHERE id = $2 RETURNING *",
        [role, id]
    );
    return result.rows[0];
};

export const getAllAccountsService = async(client) => {
    const result = await client.query(
        "SELECT id, name, role, valid FROM users"
    );
    return result.rows;
};