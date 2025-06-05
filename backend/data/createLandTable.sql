CREATE TABLE IF NOT EXISTS land (
    id INT PRIMARY KEY,
    wood INT DEFAULT 0,
    bricks INT DEFAULT 0,
    livestock INT DEFAULT 0,
    wheat INT DEFAULT 0,
    ore INT DEFAULT 0,
    textiles INT DEFAULT 0,
    FOREIGN KEY (id) REFERENCES og(id) ON DELETE CASCADE
);


DROP TRIGGER IF EXISTS after_update_land ON land;


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


CREATE TRIGGER after_update_land
AFTER UPDATE ON land
FOR EACH ROW
EXECUTE FUNCTION wheel_update(); 