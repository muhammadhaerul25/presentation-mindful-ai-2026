import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'(<section[^>]*id="slide-qa-board"[^>]*)style="([^"]*)"'
match = re.search(pattern, content)

if match:
    section_start = match.group(1)
    style_content = match.group(2)
    
    # Remove position: relative; and overflow: hidden;
    style_content = style_content.replace('position: relative;', '')
    style_content = style_content.replace('overflow: hidden;', '')
    
    # Put background: var(--surface) back if I changed it to #ffffff previously
    style_content = style_content.replace('background: #ffffff;', 'background: var(--surface);')
    
    # Clean up multiple spaces
    style_content = re.sub(r'\s+', ' ', style_content).strip()
    
    new_section = f'{section_start}style="{style_content}"'
    
    content = content.replace(match.group(0), new_section)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed slide-qa-board CSS positioning bug.")
else:
    print("slide-qa-board not found or has no style attribute.")
