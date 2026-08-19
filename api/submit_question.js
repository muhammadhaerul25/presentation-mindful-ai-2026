const { Pool } = require('pg');

// Vercel Serverless Function
export default async function handler(req, res) {

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Hanya terima POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { nama, pertanyaan } = req.body;

  if (!nama || !pertanyaan) {
    return res.status(400).json({ error: 'Nama dan pertanyaan wajib diisi.' });
  }

  // Gunakan connection string yang diberikan
  // (Lebih baik gunakan process.env.DATABASE_URL di masa depan)
  const connectionString = 'postgresql://postgres.xtcfptlwbzgrdxpfkcux:muhammadhaerul2512@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

  const pool = new Pool({
    connectionString,
    // Tambahkan ssl rejectUnauthorized: false jika pooler butuh ssl
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Insert ke tabel mindful-ai-questions
    const query = `
      INSERT INTO "mindful-ai-questions" (nama, pertanyaan) 
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [nama, pertanyaan];

    const result = await pool.query(query, values);

    // Kirim respons sukses
    res.status(200).json({ 
      success: true, 
      message: 'Pertanyaan berhasil disimpan.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Gagal menyimpan pertanyaan ke database.', detail: error.message });
  } finally {
    // Selalu tutup pool di serverless function agar tidak open connection terbuang
    await pool.end();
  }
}
