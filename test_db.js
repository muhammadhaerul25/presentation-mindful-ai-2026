const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.xtcfptlwbzgrdxpfkcux:muhammadhaerul2512@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query('SELECT * FROM "mindful-ai-questions" LIMIT 1');
    console.log('Select success:', res.rows);
  } catch (err) {
    console.error('Error querying:', err.message);
  } finally {
    pool.end();
  }
}
run();
