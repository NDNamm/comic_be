import pool from '../config/database.js';

export const findComicById = async (id) => {
  const result = await pool.query(
    'SELECT * from comics where id = $1',
    [id]
  );
  return result.rows[0];
};

export const getAllComic = async () => {
  const result = await pool.query(
    `SELECT 
      comics.*,
      STRING_AGG(DISTINCT chapters.name || ' (' || chapters.created_at || ')', ', ') AS chapters
    FROM comics
    JOIN comic_genres ON comics.id = comic_genres.comic_id
    LEFT JOIN chapters ON chapters.comic_id = comics.id
    GROUP BY comics.id, comics.name`
  );

  return result.rows;
};

export const getComicSlug = async (slug) => {
  const result = await pool.query(
    `SELECT 
      comics.*,
      STRING_AGG(DISTINCT genres.name, ', ') AS genres,
      STRING_AGG(DISTINCT chapters.name || ' (' || chapters.created_at || ')', ', ') AS chapters
    FROM comics
    JOIN comic_genres ON comics.id = comic_genres.comic_id
    JOIN genres ON comic_genres.genre_id = genres.id
    LEFT JOIN chapters ON chapters.comic_id = comics.id
    WHERE comics.slug = $1
    GROUP BY comics.id`,
    [slug]
  );

  return result.rows[0];
};

export const addComic = async (name, slug, description, img_url, author, status, created_at, genreIds) => {
  const conn = await pool.connect();
  try {
    await conn.query('BEGIN');

    const comicResult = await conn.query(
      `INSERT INTO comics (name, slug, description, img_url, author, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, slug, description, img_url, author, status, created_at]
    );

    const comic = comicResult.rows[0];

    let genreIdArray = genreIds;
    if (typeof genreIds === "string") {
      genreIdArray = JSON.parse(genreIds);
    }

    for (const genreId of genreIdArray) {
      await conn.query(
        'INSERT INTO comic_genres (comic_id, genre_id) VALUES ($1, $2)',
        [comic.id, genreId]
      );
    }

    await conn.query('COMMIT');
    return comic;
  } catch (error) {
    console.error('Error adding comic:', error);
    await conn.query('ROLLBACK');
  } finally {
    conn.release();
  }
};

export const updateComic = async (id, name, slug, description, img_url, author, status, updated_at, genreIds) => {
  const conn = await pool.connect();
  try {
    const comicResult = await pool.query(
      `UPDATE comics SET name = $1, slug = $2, description = $3, img_url = $4, author = $5, status = $6, updated_at = $7
        where id = $8
        RETURNING *`,
      [name, slug, description, img_url, author, status, updated_at, id]
    );

    const comic = comicResult.rows[0];

    await conn.query(
      `DELETE FROM comic_genres WHERE comic_id = $1`,
      [id]
    );

    let genreIdArray = genreIds;
    if (typeof genreIds === "string") {
      genreIdArray = JSON.parse(genreIds);
    }

    for (const genreId of genreIdArray) {
      await conn.query(
        'INSERT INTO comic_genres (comic_id, genre_id) VALUES ($1, $2)',
        [comic.id, genreId]
      );
    }

    await conn.query('COMMIT');
    return comic;
  } catch (error) {
    console.error('Error adding comic:', error);
    await conn.query('ROLLBACK');
  } finally {
    conn.release();
  }
};

export const deleteComic = async(id) =>{
  const result = pool.query(
    'DELETE from comics where id = $1',
    [id]
  );
  return (await result).rows[0]; 
}


