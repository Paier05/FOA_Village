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


CREATE TRIGGER after_update_land
AFTER UPDATE ON land
FOR EACH ROW
EXECUTE FUNCTION wheel_update(); 