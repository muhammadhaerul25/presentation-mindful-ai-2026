const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 3000;

// Enable CORS so the HTML file can send requests to this API
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the project root
const path = require('path');
app.use(express.static(path.join(__dirname)));

// Serve the PDF file
app.get('/full-materi.pdf', (req, res) => {
    res.sendFile(path.join(__dirname, 'full-materi.pdf'));
});

// Connection string provided by the user
const connectionString = 'postgresql://postgres.xtcfptlwbzgrdxpfkcux:muhammadhaerul2512@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString: connectionString,
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL successfully.'))
    .catch(err => console.error('Connection error', err.stack));

// Endpoint to handle form submission
app.post('/api/submit', async (req, res) => {
    const { namaLengkap, urlLinkedin } = req.body;

    if (!namaLengkap || !urlLinkedin) {
        return res.status(400).json({ error: 'Nama Lengkap dan URL LinkedIn harus diisi.' });
    }

    try {
        // Insert into the specified table name: gsa-aiforge_akun-linkedin
        // Note: Table names with hyphens must be quoted in PostgreSQL
        const queryText = `INSERT INTO "gsa-aiforge_akun-linkedin" (nama_lengkap, url_linkedin) VALUES ($1, $2) RETURNING *`;
        const values = [namaLengkap, urlLinkedin];

        const result = await client.query(queryText, values);
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('Error inserting data:', err);
        // Supabase often creates tables with "id" auto-increment. 
        // If the table doesn't exist yet, we will get an error.
        res.status(500).json({ error: err.message || 'Terjadi kesalahan saat menyimpan data ke database.' });
    }
});

// Endpoint to get all feedback
app.get('/api/get_feedback', async (req, res) => {
    try {
        const queryText = `SELECT id, nama_lengkap, email, rating, alasan, pesan_kesan, created_at FROM "gsa-aiforge_feedback" ORDER BY created_at DESC`;
        const result = await client.query(queryText);
        res.status(200).json({ success: true, count: result.rowCount, data: result.rows });
    } catch (err) {
        console.error('Error fetching feedback:', err);
        res.status(500).json({ error: err.message || 'Terjadi kesalahan saat mengambil data feedback.' });
    }
});

// Endpoint to get all submitted accounts
app.get('/api/accounts', async (req, res) => {
    try {
        const queryText = `SELECT nama_lengkap, url_linkedin FROM "gsa-aiforge_akun-linkedin" ORDER BY created_at ASC`;
        const result = await client.query(queryText);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: err.message || 'Terjadi kesalahan saat mengambil data.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
