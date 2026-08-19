import re

def add_cors(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    cors_logic = """
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
"""
    
    if "Access-Control-Allow-Origin" not in content:
        content = content.replace("export default async function handler(req, res) {", "export default async function handler(req, res) {\n" + cors_logic)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

add_cors('api/get_questions.js')
add_cors('api/submit_question.js')
print("CORS added.")
