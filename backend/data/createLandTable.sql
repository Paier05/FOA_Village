CREATE TABLE IF NOT EXISTS land (
    id INT PRIMARY KEY,
    wood INT DEFAULT 0,
    bricks INT DEFAULT 0,
    livestock INT DEFAULT 0,
    wheat INT DEFAULT 0,
    ore INT DEFAULT 0,
    textiles INT DEFAULT 0,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);


DROP TRIGGER IF EXISTS after_update_land ON land;
DROP TRIGGER IF EXISTS after_update_land_score ON land;


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


CREATE TRIGGER after_update_land
AFTER UPDATE ON land
FOR EACH ROW
EXECUTE FUNCTION wheel_update(); 


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


CREATE TRIGGER after_update_land_score
AFTER UPDATE ON land
FOR EACH ROW
EXECUTE FUNCTION update_og_score();