const { Pool } = require('pg');

export default async function handler(req, res) {

  // Set CORS headers
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const connectionString = 'postgresql://postgres.xtcfptlwbzgrdxpfkcux:muhammadhaerul2512@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const query = 'SELECT id, nama, pertanyaan, created_at FROM "mindful-ai-questions" ORDER BY created_at ASC;';
    const result = await pool.query(query);

    res.status(200).json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Gagal mengambil data dari database.', detail: error.message });
  } finally {
    await pool.end();
  }
}
