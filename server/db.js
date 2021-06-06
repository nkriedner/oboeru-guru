const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/oboe-guru");

// Function for registering users:
module.exports.registerUser = (
    first_name,
    last_name,
    email_address,
    password_hash
) => {
    // To prevent SQL injection:
    const q = `
        INSERT INTO users (first_name, last_name, email_address, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `;
    const params = [first_name, last_name, email_address, password_hash];
    return db.query(q, params);
};

// Function for finding a user in users table:
module.exports.findUser = (email_address) => {
    const q = `
        SELECT * FROM users
        WHERE email_address = $1
    `;
    const params = [email_address];
    return db.query(q, params);
};

// Function for getting a users infos:
module.exports.getUserInfos = (userId) => {
    const q = `
        SELECT * FROM users
        WHERE id = $1
    `;
    const params = [userId];
    return db.query(q, params);
};

// Function for uploading a user image:
module.exports.uploadImage = (imageUrl, userId) => {
    const q = `
        UPDATE users
        SET imageUrl = $1
        WHERE id = $2
        RETURNING *
    `;
    const params = [imageUrl, userId];
    return db.query(q, params);
};

// Function for updating a users bio:
module.exports.updateBio = (bio, userId) => {
    const q = `
        UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING *
    `;
    const params = [bio, userId];
    return db.query(q, params);
};

// Function for updating a user password in users table:
module.exports.updateUserPassword = (hashed_password, email_address) => {
    const q = `
        UPDATE users
        SET password_hash = $1
        WHERE email_address = $2
        RETURNING *
    `;
    const params = [hashed_password, email_address];
    return db.query(q, params);
};

// Function for inserting code in reset_codes table:
module.exports.insertCode = (email, code) => {
    const q = `
        INSERT INTO reset_codes (email, code)
        VALUES ($1, $2)
        RETURNING *
    `;
    const params = [email, code];
    return db.query(q, params);
};

// Function for finding the code in reset_codes table:
module.exports.findCode = (email) => {
    const q = `
        SELECT * FROM reset_codes
        WHERE email = $1
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        ORDER BY created_at DESC
        LIMIT 1
    `;
    const params = [email];
    return db.query(q, params);
};

// Function for getting memo_content data:
module.exports.getMemoContent = (holder_id) => {
    const q = `
        SELECT * FROM memo_content
        WHERE holder_id = $1
    `;
    const params = [holder_id];
    return db.query(q, params);
};

// Fution for updating memo_level:
module.exports.updateMemoLevel = (memo_id, memo_level) => {
    const q = `
        UPDATE memo_content
        SET memo_level = $2
        WHERE id = $1
        RETURNING *
    `;
    const params = [memo_id, memo_level];
    return db.query(q, params);
};

// Function for adding memo content:
module.exports.addMemoContent = (content_1, content_2, holder_id) => {
    const q = `
        INSERT INTO memo_content (content_1, content_2, holder_id, memo_level)
        VALUES ($1, $2, $3, 1)
        RETURNING *
    `;
    const params = [content_1, content_2, holder_id];
    return db.query(q, params);
};
