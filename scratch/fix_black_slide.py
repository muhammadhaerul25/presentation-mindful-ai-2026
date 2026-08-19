import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'(<section[^>]*id="slide-qa-board"[^>]*>.*?)</section>'
match = re.search(pattern, content, flags=re.DOTALL)

if match:
    slide_content = match.group(1)
    
    # Replace "filter: blur(60px);" with ""
    fixed_content = slide_content.replace('filter: blur(60px);', '')
    
    # Ensure background is #ffffff
    fixed_content = fixed_content.replace('background: var(--surface);', 'background: #ffffff;')
    
    content = content.replace(slide_content, fixed_content)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed slide-qa-board black screen bug.")
else:
    print("slide-qa-board not found.")
