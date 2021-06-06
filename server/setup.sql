DROP TABLE IF EXISTS memo_content;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL CHECK (first_name != ''),
    last_name  VARCHAR NOT NULL CHECK (last_name != ''),
    email_address  VARCHAR NOT NULL UNIQUE CHECK (email_address != ''),
    password_hash  VARCHAR NOT NULL CHECK (password_hash != ''),
    imageUrl Text,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL CHECK (email != ''),
    code VARCHAR NOT NULL CHECK (code != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE memo_content(
    id SERIAL PRIMARY KEY,
    content_1 TEXT,
    content_2 TEXT,
    memo_level SMALLINT,
    holder_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Advanced memo-content table:

-- CREATE TABLE memo_content(
--     id SERIAL PRIMARY KEY,
--     content_1 TEXT,
--     content_2 TEXT,
--     memo_level SMALLINT,
--     memo_level_1 SMALLINT,
--     memo_level_2 SMALLINT,
--     holder_id INT REFERENCES users(id) NOT NULL,
--     upgrade_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
