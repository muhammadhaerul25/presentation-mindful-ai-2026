import re
with open(r'c:\Users\Asus\Documents\presentation-mindful-ai-2026\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

base64_imgs = re.findall(r'data:image/[^;]+;base64,[^\"]+', content)
print(f'Total size: {len(content)} bytes')
print(f'Base64 images count: {len(base64_imgs)}')
print(f'Base64 images total size: {sum(len(img) for img in base64_imgs)} bytes')
