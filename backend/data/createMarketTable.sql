CREATE TABLE IF NOT EXISTS market (
    wood INT DEFAULT 1,
    bricks INT DEFAULT 1,
    livestock INT DEFAULT 1,
    wheat INT DEFAULT 1,
    ore INT DEFAULT 1,
    textiles INT DEFAULT 1
);


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM market) THEN
    INSERT INTO market DEFAULT VALUES;
    END IF;
END $$;