import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_func = """      async function fetchQuestions() {
        try {
          const response = await fetch("/api/get_questions");
          const data = await response.json();"""

new_func = """      async function fetchQuestions() {
        try {
          const apiUrl = window.location.protocol === 'file:' 
            ? 'https://mindful-ai-2026.vercel.app/api/get_questions' 
            : '/api/get_questions';
          const response = await fetch(apiUrl);
          
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const data = await response.json();"""

content = content.replace(old_func, new_func)

old_catch = """        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      }"""

new_catch = """        } catch (error) {
          console.error("Error fetching questions:", error);
          const list = document.getElementById("qa-list");
          if (list) {
            list.innerHTML = '<div style="text-align: center; padding: 40px; color: #d93025; font-weight: 500;">Gagal memuat pertanyaan. <br><span style="font-size:14px; font-weight:400; color:var(--text-muted)">Pastikan internet stabil. Jika Anda membuka presentasi ini secara lokal (file:///), Anda harus men-deploy kode ke Vercel agar koneksi ke database berjalan normal.</span></div>';
          }
        }
      }"""

content = content.replace(old_catch, new_catch)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated fetch logic.")
