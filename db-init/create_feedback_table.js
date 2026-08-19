const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.xtcfptlwbzgrdxpfkcux:muhammadhaerul2512@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS "mindful-ai-feedbacks" (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL,
        alasan TEXT NOT NULL,
        pesan TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log('Feedback table created successfully');
  } catch (err) {
    console.error('Error creating table:', err.message);
  } finally {
    pool.end();
  }
}
run();
