CREATE TABLE IF NOT EXISTS gamephase (
    phase TEXT NOT NULL,
    endtime TIME NOT NULL
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM gamephase) THEN
    INSERT INTO gamephase(phase, endtime) VALUES ('1st 发展期', '00:00:00');
    END IF;
END $$;