CREATE TABLE IF NOT EXISTS events (
    event TEXT CHECK (event IN (
        '干旱', '丰收时期', '瘟疫蔓延', '畜牧繁荣', 
        '森林失火', '伐木盛年', '矿井坍塌', '富矿突现',
        '王室修城令', '千锤百炼', '蛾灾肆虐', '织女降凡'
    )) NOT NULL,
    expiry TIME NOT NULL
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM events) THEN
    INSERT INTO events(event, expiry) VALUES ('干旱', '00:00:00');
    END IF;
END $$;