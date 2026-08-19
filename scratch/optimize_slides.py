import re

file_path = r'c:\Users\Asus\Documents\presentation-mindful-ai-2026\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add custom-scroll CSS and class to qa-list
custom_css = """
          <style>
            #qa-list::-webkit-scrollbar {
              width: 8px;
            }
            #qa-list::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.02);
              border-radius: 4px;
            }
            #qa-list::-webkit-scrollbar-thumb {
              background: rgba(13, 130, 70, 0.2);
              border-radius: 4px;
            }
            #qa-list::-webkit-scrollbar-thumb:hover {
              background: rgba(13, 130, 70, 0.4);
            }
            
            @keyframes pulse-shadow {
              0% { box-shadow: 0 4px 12px rgba(52, 168, 83, 0.2); }
              50% { box-shadow: 0 4px 24px rgba(52, 168, 83, 0.5); }
              100% { box-shadow: 0 4px 12px rgba(52, 168, 83, 0.2); }
            }
            .qr-pulse {
              animation: pulse-shadow 2s infinite ease-in-out;
            }
          </style>
"""

# Insert custom css right before slide-qa-board
content = re.sub(
    r'(<section[^>]*id="slide-qa-board")',
    custom_css + r'\1',
    content
)

# Add custom scroll class to qa-list (if it isn't already styled properly)
# qa-list already has overflow-y: auto. The pseudo-elements will target it directly via #qa-list.

# 2. Add qr-pulse class to the QR Code container
content = re.sub(
    r'(<div style="background: white; padding: 16px; border-radius: 16px; box-shadow: 0 4px 12px rgba\(0,0,0,0\.05\);)',
    r'\1 qr-pulse',
    content
) # Wait, adding class to inline style string won't work well. Let's just add class="qr-pulse"
content = re.sub(
    r'<div style="background: white; padding: 16px; border-radius: 16px; box-shadow: 0 4px 12px rgba\(0,0,0,0\.05\);">',
    r'<div class="qr-pulse" style="background: white; padding: 16px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html")
