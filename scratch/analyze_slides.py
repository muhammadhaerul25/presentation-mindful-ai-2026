import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all <section> elements that have class containing "slide"
pattern = r'<section[^>]*class="[^"]*slide[^"]*"[^>]*>'
matches = list(re.finditer(pattern, content))

print(f"Total slides found: {len(matches)}")
for i, match in enumerate(matches):
    start = match.start()
    end = content.find('</section>', start) + 10
    slide_html = content[start:end]
    
    id_match = re.search(r'id="([^"]+)"', slide_html)
    slide_id = id_match.group(1) if id_match else "NO_ID"
    
    print(f"{i+1}. {slide_id}")

    if 'slide-qa-board' in slide_html:
        print(">>> FOUND QA BOARD HERE:")
        print(slide_html[:200] + "...")
