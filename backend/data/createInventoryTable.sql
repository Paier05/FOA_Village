CREATE TABLE IF NOT EXISTS inventory (
    effect_id SERIAL PRIMARY KEY,
    id INT NOT NULL,
    effect TEXT CHECK (effect IN (
        '釜底抽薪', '釜底抽薪+', '天道酬勤', '天道酬勤+', 
        '梅林的魔法', '防御工事', '石中剑', '知己知彼',
        '兵不厌诈', '兵不厌诈+', '抛砖引玉', '十面埋伏', '十面埋伏+'
    )) NOT NULL,
    target INT NOT NULL,
    type TEXT CHECK (type IN (
        'wood', 'bricks', 'livestock', 'wheat', 'ore', 'textiles', 'others'
    )) NOT NULL,
    expiry TIME,
    status INT CHECK (status IN (0, 1)) DEFAULT 1,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (target) REFERENCES users(id) ON DELETE CASCADE
);