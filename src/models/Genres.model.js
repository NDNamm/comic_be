import pool from '../config/database.js';

export const findGenreById = async (id) => {
    const result = pool.query(
        'SELECT * from genres where id = $1',
        [id]
    );
    return result.rows[0];
};