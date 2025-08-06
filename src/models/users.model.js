import pool from "../config/database.js"

export const findUserByUserName = async (username) => {
    const result = await pool.query(
        `SELECT * from users where username = $1`,
        [username]
    )
    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * from users where email = $1`,
        [email]
    )
    return result.rows[0];
};

export const addUser = async (username, email, password, created_at) => {
    const result = await pool.query(
        `INSERT INTO users (username, email, password, created_at, role_id) VALUES ($1, $2, $3, $4, 1) RETURNING *`,
        [username, email, password, created_at]
    )
    return result.rows[0];
};