CREATE TABLE IF NOT EXISTS resources (
    id INT PRIMARY KEY,
    wood INT DEFAULT 10,
    bricks INT DEFAULT 10,
    livestock INT DEFAULT 10,
    wheat INT DEFAULT 10,
    ore INT DEFAULT 10,
    textiles INT DEFAULT 10,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);