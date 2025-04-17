import { Pool } from 'pg';
import { Connector } from '@google-cloud/sql-connector-pg-pg';
import { ListingType } from '../types';

const connector = new Connector();

const createPool = async () => {
  const pool = new Pool({
    user: import.meta.env.VITE_DB_USER,
    password: import.meta.env.VITE_DB_PASSWORD,
    database: import.meta.env.VITE_DB_NAME,
    port: 5432,
    host: await connector.getHost({
      instanceConnectionName: import.meta.env.VITE_INSTANCE_CONNECTION_NAME,
    }),
  });

  return pool;
};

let pool: Pool;

const getPool = async () => {
  if (!pool) {
    pool = await createPool();
  }
  return pool;
};

export const db = {
  listings: {
    async getAll() {
      const pool = await getPool();
      const result = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
      return result.rows;
    },

    async create(data: Omit<ListingType, 'id' | 'created_at'>) {
      const pool = await getPool();
      const result = await pool.query(
        `INSERT INTO listings (
          title, category, subcategory, attributes, user_id, location, contact
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [data.title, data.category, data.subcategory, data.attributes, data.user_id, data.location, data.contact]
      );
      return result.rows[0];
    },

    async getByCategory(category: string, subcategory: string) {
      const pool = await getPool();
      const result = await pool.query(
        'SELECT * FROM listings WHERE category = $1 AND subcategory = $2 ORDER BY created_at DESC',
        [category, subcategory]
      );
      return result.rows;
    },

    async getByUser(userId: string) {
      const pool = await getPool();
      const result = await pool.query(
        'SELECT * FROM listings WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    },

    async update(id: string, userId: string, data: Partial<ListingType>) {
      const pool = await getPool();
      const setClause = Object.keys(data)
        .map((key, index) => `${key} = $${index + 3}`)
        .join(', ');
      
      const values = Object.values(data);
      
      const result = await pool.query(
        `UPDATE listings SET ${setClause} 
         WHERE id = $1 AND user_id = $2 
         RETURNING *`,
        [id, userId, ...values]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Listing not found or unauthorized');
      }
      
      return result.rows[0];
    },

    async delete(id: string, userId: string) {
      const pool = await getPool();
      const result = await pool.query(
        'DELETE FROM listings WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Listing not found or unauthorized');
      }
    }
  }
};
