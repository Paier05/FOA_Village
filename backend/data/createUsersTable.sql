CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role TEXT CHECK (role IN ('admin', 'og')) NOT NULL,
    valid INT CHECK (valid IN (0, 1)) DEFAULT 0
);


DROP TRIGGER IF EXISTS after_register ON users;


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


CREATE TRIGGER after_register
AFTER UPDATE ON users
FOR EACH ROW 
EXECUTE FUNCTION after_registration();