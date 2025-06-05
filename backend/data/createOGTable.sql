CREATE TABLE IF NOT EXISTS og (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    score INT NOT NULL
);


DROP TRIGGER IF EXISTS after_insert_og ON og;


CREATE OR REPLACE FUNCTION after_insert_og_row()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO resources(id) VALUES (NEW.id);
    INSERT INTO land(id) VALUES (NEW.id);
    INSERT INTO wheel(id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_insert_og
AFTER INSERT ON og
FOR EACH ROW 
EXECUTE FUNCTION after_insert_og_row();