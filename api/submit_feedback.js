const { Pool } = require("pg");

// Vercel Serverless Function
export default async function handler(req, res) {
  // Set CORS headers
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Hanya terima POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { nama, email, rating, alasan, pesan } = req.body;

  if (!nama || !email || !rating || !alasan || !pesan) {
    return res.status(400).json({ error: "Semua kolom wajib diisi." });
  }

  // Gunakan connection string yang diberikan
  const connectionString =
    "postgresql://postgres.xtcfptlwbzgrdxpfkcux:muhammadhaerul2512@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // 1. Insert ke tabel mindful-ai-feedbacks
    const query1 = `
      INSERT INTO "mindful-ai-feedbacks" (nama, email, rating, alasan, pesan) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values1 = [nama, email, rating, alasan, pesan];

    const result = await pool.query(query1, values1);

    // 2. Insert ke tabel feedbacks
    const query2 = `
      INSERT INTO feedbacks (nama_lengkap, email, rating, alasan, pesan_kesan, source, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, NOW());
    `;
    const values2 = [nama, email, rating, alasan, pesan, 'Mindful AI 2026'];
    
    await pool.query(query2, values2);

    // Kirim respons sukses
    res.status(200).json({
      success: true,
      message: "Feedback berhasil disimpan.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res
      .status(500)
      .json({
        error: "Gagal menyimpan feedback ke database.",
        detail: error.message,
      });
  } finally {
    // Selalu tutup pool di serverless function agar tidak open connection terbuang
    await pool.end();
  }
}
