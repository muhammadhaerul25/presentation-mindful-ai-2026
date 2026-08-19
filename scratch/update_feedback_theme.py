import re

def update_theme(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update :root vars
    content = re.sub(
        r'--primary: #1a73e8;', 
        r'--primary: #34a853;\n        --primary-dark: #0d8246;', 
        content
    )

    # Update container top border
    content = re.sub(
        r'background: linear-gradient\(to right,[\s\S]*?#34a853 100%\);',
        r'background: linear-gradient(to right, #0d8246, #34a853);',
        content
    )

    # Update submit button hover state
    content = re.sub(
        r'\.btn-submit:hover:not\(:disabled\) \{\s*background: #1557b0;\s*\}',
        r'.btn-submit:hover:not(:disabled) {\n        background: var(--primary-dark);\n      }',
        content
    )

    # Update submit button disabled state
    content = re.sub(
        r'\.btn-submit:disabled \{\s*background: #8ab4f8;\s*cursor: not-allowed;\s*\}',
        r'.btn-submit:disabled {\n        background: #94a3b8;\n        cursor: not-allowed;\n      }',
        content
    )

    # Update rating checked background to a light green instead of light blue
    content = re.sub(
        r'background: #e8f0fe;',
        r'background: #e6f4ea;',
        content
    )

    # Update success button text color hover state in html
    content = re.sub(
        r'color: #1a73e8;',
        r'color: #0d8246;',
        content
    )
    content = re.sub(
        r"this.style.background = '#f4f8fe';",
        r"this.style.background = '#e6f4ea';",
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {filepath}")

update_theme(r'c:\Users\Asus\Documents\presentation-mindful-ai-2026\form-feedbacks\index.html')
