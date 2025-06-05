import pool from "../config/db.js";

export const createOGTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS og (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    score INT NOT NULL);
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
    FOREIGN KEY (id) REFERENCES og(id) ON DELETE CASCADE);
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
    FOREIGN KEY (id) REFERENCES og(id) ON DELETE CASCADE);
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
    FOREIGN KEY (id) REFERENCES og(id) ON DELETE CASCADE);
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating wheel table: ", error);
    };
};


export const dropOGTableTrigger = async() => {
    const queryText = `
    DROP TRIGGER IF EXISTS after_insert_og ON og;
    `
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error dropping resources trigger: ", error);
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


export const ogTableTriggerFunction = async() => {
    const queryText = `
    CREATE OR REPLACE FUNCTION insert_resources_row()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO resources(id) VALUES (NEW.id);
        INSERT INTO land(id) VALUES (NEW.id);
        INSERT INTO wheel(id) VALUES (NEW.id);
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating og table trigger function: ", error);
    };
};

export const ogTableTrigger = async() => {
    const queryText = `
    CREATE TRIGGER after_insert_og
    AFTER INSERT ON og
    FOR EACH ROW 
    EXECUTE FUNCTION insert_resources_row();
    `
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating og table trigger: ", error);
    };
};

export const landTableTriggerFunction = async() => {
    const queryText = `
    CREATE OR REPLACE FUNCTION wheel_update()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE wheel
        SET 
            wheel.wood = NEW.wood,
            wheel.bricks = NEW.bricks,
            wheel.livestock = NEW.livestock,
            wheel.wheat = NEW.wheat,
            wheel.ore = NEW.ore,
            wheel.textiles = NEW.textiles
        WHERE wheel.id = NEW.id;
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