CREATE TABLE IF NOT EXISTS gamephase (
    phase TEXT NOT NULL,
    starttime TIME NOT NULL
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM gamephase) THEN
    INSERT INTO gamephase(phase, starttime) VALUES ('1st Development Phase', '00:00:00');
    END IF;
END $$;