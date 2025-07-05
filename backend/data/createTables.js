import pool from "../config/db.js";

export const createUsersTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role TEXT CHECK (role IN ('admin', 'npc', 'moderator', 'og')) NOT NULL,
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
    smmf INT NOT NULL DEFAULT 100,
    fygs INT NOT NULL DEFAULT 1,
    szj INT NOT NULL DEFAULT 1,
    pzyy INT NOT NULL DEFAULT 1,
    gold INT NOT NULL DEFAULT 0,
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

export const createMarketTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS market (
    wood INT DEFAULT 1,
    bricks INT DEFAULT 1,
    livestock INT DEFAULT 1,
    wheat INT DEFAULT 1,
    ore INT DEFAULT 1,
    textiles INT DEFAULT 1);
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating market table: ", error);
    };
};

export const initializeMarketTable = async() => {
    const queryText = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM market) THEN
        INSERT INTO market DEFAULT VALUES;
        END IF;
    END $$;
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error initializing market table: ", error);
    };
};


export const createWheelTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS wheel (
    id INT PRIMARY KEY,
    blank INT DEFAULT 3,
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


export const createGamePhaseTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS gamephase (
    phase TEXT NOT NULL,
    endtime TIME NOT NULL);
    `;
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating game phase table: ", error);
    };
};


export const initializeGamePhaseTable = async() => {
    const queryText = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM gamephase) THEN
        INSERT INTO gamephase(phase, endtime) VALUES ('1st Development Phase', '00:00:00');
        END IF;
    END $$;
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error initializing game phase table: ", error);
    };
};


export const createInventoryTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS inventory (
    effect_id SERIAL PRIMARY KEY,
    id INT NOT NULL,
    effect TEXT CHECK (effect IN (
        '釜底抽薪', '釜底抽薪+', '天道酬勤', '天道酬勤+', 
        '梅林的魔法', '防御工事', '石中剑', '知己知彼',
        '兵不厌诈', '抛砖引玉', '十面埋伏'
    )) NOT NULL,
    target INT NOT NULL,
    type TEXT CHECK (type IN (
        'wood', 'bricks', 'livestock', 'wheat', 'ore', 'textiles', 'others'
    )) NOT NULL,
    expiry TIME,
    status INT CHECK (status IN (0, 1)) DEFAULT 1,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (target) REFERENCES users(id) ON DELETE CASCADE);
    `;
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating game phase table: ", error);
    };
};


export const createEventsTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS events (
    event TEXT CHECK (event IN (
        '干旱', '丰收时期', '瘟疫蔓延', '畜牧繁荣', 
        '森林失火', '伐木盛年', '矿井坍塌', '富矿突现',
        '王室修城令', '千锤百炼', '蛾灾肆虐', '织女降凡'
    )) NOT NULL,
    expiry TIME NOT NULL);
    `;
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating events table: ", error);
    };
};


export const initializeEventsTable = async() => {
    const queryText = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM events) THEN
        INSERT INTO events(event, expiry) VALUES ('干旱', '00:00:00');
        END IF;
    END $$;
    `;
    try
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error initializing events table: ", error);
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


export const dropLandTableScoreTrigger = async() => {
    const queryText = `
    DROP TRIGGER IF EXISTS after_update_land_score ON land;
    `
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error dropping land score update trigger: ", error);
    };
};


export const usersTableTriggerFunction = async() => {
    const queryText = `
    CREATE OR REPLACE FUNCTION after_registration()
    RETURNS TRIGGER AS $$
    BEGIN
        -- DELETE IF PROMOTION FROM OG
        IF OLD.role = 'og' AND NEW.role != 'og' THEN
            DELETE FROM og WHERE id = OLD.id;
            DELETE FROM resources WHERE id = OLD.id;
            DELETE FROM land WHERE id = OLD.id;
            DELETE FROM wheel WHERE id = OLD.id;
            DELETE FROM inventory WHERE id = OLD.id;
            DELETE FROM inventory WHERE target = OLD.id;

        -- DELETE IF OG ACCOUNT DEACTIVATED
        ELSIF OLD.role = 'og' AND NEW.role = 'og' AND OLD.valid = 1 AND NEW.valid = 0 THEN
            DELETE FROM og WHERE id = OLD.id;
            DELETE FROM resources WHERE id = OLD.id;
            DELETE FROM land WHERE id = OLD.id;
            DELETE FROM wheel WHERE id = OLD.id;
            DELETE FROM inventory WHERE id = OLD.id;
            DELETE FROM inventory WHERE target = OLD.id;
        END IF;

        -- INSERT IF DEMOTION TO OG AND IT IS VALID
        IF NEW.role = 'og' AND OLD.role != 'og' AND NEW.valid = 1 THEN
            INSERT INTO og(id) VALUES (NEW.id);
            INSERT INTO resources(id) VALUES (NEW.id);
            INSERT INTO land(id) VALUES (NEW.id);
            INSERT INTO wheel(id) VALUES (NEW.id);

        -- INSERT UF OG ACCOUNT VALIDATED
        ELSIF NEW.role = 'og' AND OLD.valid = 0 AND NEW.valid = 1 THEN
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
    DECLARE
        total_increase INTEGER := 0;
        new_blank INTEGER;
    BEGIN
        IF NEW.wood > OLD.wood THEN
            total_increase := total_increase + (NEW.wood - OLD.wood);
        END IF;

        IF NEW.bricks > OLD.bricks THEN
            total_increase := total_increase + (NEW.bricks - OLD.bricks);
        END IF;

        IF NEW.livestock > OLD.livestock THEN
            total_increase := total_increase + (NEW.livestock - OLD.livestock);
        END IF;

        IF NEW.wheat > OLD.wheat THEN
            total_increase := total_increase + (NEW.wheat - OLD.wheat);
        END IF;

        IF NEW.ore > OLD.ore THEN
            total_increase := total_increase + (NEW.ore - OLD.ore);
        END IF;

        IF NEW.textiles > OLD.textiles THEN
            total_increase := total_increase + (NEW.textiles - OLD.textiles);
        END IF;

        UPDATE wheel
        SET 
            wood = NEW.wood,
            bricks = NEW.bricks,
            livestock = NEW.livestock,
            wheat = NEW.wheat,
            ore = NEW.ore,
            textiles = NEW.textiles
        WHERE id = NEW.id;

        IF total_increase > 0 THEN
            SELECT blank INTO new_blank FROM wheel WHERE id = NEW.id;

            IF new_blank > 0 THEN
                IF new_blank >= total_increase THEN
                    new_blank := new_blank - total_increase;
                ELSE
                    new_blank := 0;
                END IF;

                UPDATE wheel
                SET blank = new_blank
                WHERE id = NEW.id;
            END IF;
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


export const landTableScoreTriggerFunction = async() => {
    const queryText = `
    CREATE OR REPLACE FUNCTION update_og_score()
    RETURNS TRIGGER AS $$
    DECLARE
        wood_score INT;
        bricks_score INT;
        livestock_score INT;
        wheat_score INT;
        ore_score INT;
        textiles_score INT;
        total_score INT;
    BEGIN
        wood_score := CASE
            WHEN NEW.wood < 3 THEN NEW.wood
            WHEN NEW.wood = 3 THEN 4
            WHEN NEW.wood = 4 THEN 7
            ELSE (NEW.wood - 3) * 5
        END;
        bricks_score := CASE
            WHEN NEW.bricks < 3 THEN NEW.bricks
            WHEN NEW.bricks = 3 THEN 4
            WHEN NEW.bricks = 4 THEN 7
            ELSE (NEW.bricks - 3) * 5
        END;
        livestock_score := CASE
            WHEN NEW.livestock < 3 THEN NEW.livestock
            WHEN NEW.livestock = 3 THEN 4
            WHEN NEW.livestock = 4 THEN 7
            ELSE (NEW.livestock - 3) * 5
        END;
        wheat_score := CASE
            WHEN NEW.wheat < 3 THEN NEW.wheat
            WHEN NEW.wheat = 3 THEN 4
            WHEN NEW.wheat = 4 THEN 7
            ELSE (NEW.wheat - 3) * 5
        END;
        ore_score := CASE
            WHEN NEW.ore < 3 THEN NEW.ore
            WHEN NEW.ore = 3 THEN 4
            WHEN NEW.ore = 4 THEN 7
            ELSE (NEW.ore - 3) * 5
        END;
        textiles_score := CASE
            WHEN NEW.textiles < 3 THEN NEW.textiles
            WHEN NEW.textiles = 3 THEN 4
            WHEN NEW.textiles = 4 THEN 7
            ELSE (NEW.textiles - 3) * 5
        END;
        total_score := wood_score + bricks_score + livestock_score +
                        wheat_score + ore_score + textiles_score;
        UPDATE og
        SET score = total_score
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
        console.log("Error creating land table score trigger function: ", error);
    };
};


export const landTableScoreTrigger = async() => {
    const queryText = `
    CREATE TRIGGER after_update_land_score
    AFTER UPDATE ON land
    FOR EACH ROW
    EXECUTE FUNCTION update_og_score(); 
    `
    try 
    {
        await pool.query(queryText);
    } catch (error)
    {
        console.log("Error creating land table score trigger: ", error);
    };
};