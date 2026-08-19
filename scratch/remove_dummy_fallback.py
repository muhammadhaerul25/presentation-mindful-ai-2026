import re
f = r'c:\Users\Asus\Documents\presentation-mindful-ai-2026\form-feedbacks\index.html'
with open(f, 'r', encoding='utf-8') as file:
    c = file.read()

c = re.sub(
    r'const response = await fetch\(apiUrl.*?catch[\s\S]*?success: true \}\)\)\);',
    r'''const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama, email, rating, alasan, pesan }),
          });''',
    c
)

c = re.sub(
    r'if \(!response\.ok && response\.status !== 404\) \{',
    r'if (!response.ok) {',
    c
)

c = re.sub(
    r'if\(error\.message\.includes\("Failed to fetch"\).*?else \{',
    r'if(false) {',
    c,
    flags=re.DOTALL
)

with open(f, 'w', encoding='utf-8') as file:
    file.write(c)
