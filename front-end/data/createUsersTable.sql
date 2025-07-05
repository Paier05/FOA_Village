CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role TEXT CHECK (role IN ('admin', 'npc', 'moderator', 'og')) NOT NULL,
    valid INT CHECK (valid IN (0, 1)) DEFAULT 0
);


DROP TRIGGER IF EXISTS after_register ON users;


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


CREATE TRIGGER after_register
AFTER UPDATE ON users
FOR EACH ROW 
EXECUTE FUNCTION after_registration();