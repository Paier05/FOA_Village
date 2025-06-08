import pool from "../config/db.js";

export const createUsersTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role TEXT CHECK (role IN ('admin', 'og')) NOT NULL,
    valid INT CHECK (valid IN (0, 1)) DEFAULT 0);
    `;
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating users table: ", error);
    };
};

export const createOGTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS og (
    id INT PRIMARY KEY,
    score INT NOT NULL DEFAULT 0,
    army INT NOT NULL DEFAULT 0,
    fdcx INT NOT NULL DEFAULT 2,
    fdcx_plus INT NOT NULL DEFAULT 2,
    mlmf INT NOT NULL DEFAULT 2,
    smmf INT NOT NULL DEFAULT 2,
    smmf_plus INT NOT NULL DEFAULT 2,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE);
    `;
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating og table: ", error);
    };
};

export const createResourcesTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS resources (
    id INT PRIMARY KEY,
    wood INT DEFAULT 0,
    bricks INT DEFAULT 0,
    livestock INT DEFAULT 0,
    wheat INT DEFAULT 0,
    ore INT DEFAULT 0,
    textiles INT DEFAULT 0,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE);
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating resources table: ", error);
    };
};

export const createLandTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS land (
    id INT PRIMARY KEY,
    wood INT DEFAULT 0,
    bricks INT DEFAULT 0,
    livestock INT DEFAULT 0,
    wheat INT DEFAULT 0,
    ore INT DEFAULT 0,
    textiles INT DEFAULT 0,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE);
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating land table: ", error);
    };
};

export const createFreelandTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS freeland (
    wood INT DEFAULT 5,
    bricks INT DEFAULT 5,
    livestock INT DEFAULT 5,
    wheat INT DEFAULT 5,
    ore INT DEFAULT 5,
    textiles INT DEFAULT 5);
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating freeland table: ", error);
    };
};

export const initializeFreelandTable = async() => {
    const queryText = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM freeland) THEN
        INSERT INTO freeland DEFAULT VALUES;
        END IF;
    END $$;
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error initializing freeland table: ", error);
    };
};

export const createWheelTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS wheel (
    id INT PRIMARY KEY,
    blank INT DEFAULT 0,
    wood INT DEFAULT 0,
    bricks INT DEFAULT 0,
    livestock INT DEFAULT 0,
    wheat INT DEFAULT 0,
    ore INT DEFAULT 0,
    textiles INT DEFAULT 0,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE);
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating wheel table: ", error);
    };
};


export const dropUsersTableTrigger = async() => {
    const queryText = `
    DROP TRIGGER IF EXISTS after_register ON users;
    `
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error dropping users trigger: ", error);
    };
};

export const dropLandTableTrigger = async() => {
    const queryText = `
    DROP TRIGGER IF EXISTS after_update_land ON land;
    `
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error dropping land trigger: ", error);
    };
};


export const usersTableTriggerFunction = async() => {
    const queryText = `
    CREATE OR REPLACE FUNCTION after_registration()
    RETURNS TRIGGER AS $$
    BEGIN
        IF NEW.role = 'og' AND NEW.valid = 1 THEN
            INSERT INTO og(id) VALUES (NEW.id);
            INSERT INTO resources(id) VALUES (NEW.id);
            INSERT INTO land(id) VALUES (NEW.id);
            INSERT INTO wheel(id) VALUES (NEW.id);
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating users table trigger function: ", error);
    };
};

export const usersTableTrigger = async() => {
    const queryText = `
    CREATE TRIGGER after_register
    AFTER UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION after_registration();
    `
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating users table trigger: ", error);
    };
};

export const landTableTriggerFunction = async() => {
    const queryText = `
    CREATE OR REPLACE FUNCTION wheel_update()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE wheel
        SET 
            wood = NEW.wood,
            bricks = NEW.bricks,
            livestock = NEW.livestock,
            wheat = NEW.wheat,
            ore = NEW.ore,
            textiles = NEW.textiles
        WHERE id = NEW.id;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating land table trigger function: ", error);
    };
};

export const landTableTrigger = async() => {
    const queryText = `
    CREATE TRIGGER after_update_land
    AFTER UPDATE ON land
    FOR EACH ROW
    EXECUTE FUNCTION wheel_update(); 
    `
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating land table trigger: ", error);
    };
};