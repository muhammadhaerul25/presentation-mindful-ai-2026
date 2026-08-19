import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the simple text loader with a beautiful skeleton loader
old_loader = """              <div id="qa-loader" style="text-align: center; padding: 60px; color: var(--text-muted); font-size: 18px; font-weight: 500;">
                Menarik data pertanyaan...
              </div>"""

new_loader = """              <div id="qa-loader" style="display: flex; flex-direction: column; gap: 16px;">
                <!-- Skeleton Item 1 -->
                <div style="background: rgba(255, 255, 255, 0.6); border-radius: 16px; padding: 24px; border: 1px solid rgba(13, 130, 70, 0.05);">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                    <div style="width: 120px; height: 20px; background: rgba(0,0,0,0.05); border-radius: 10px; animation: pulse 1.5s infinite ease-in-out;"></div>
                    <div style="width: 50px; height: 16px; background: rgba(0,0,0,0.04); border-radius: 8px; animation: pulse 1.5s infinite ease-in-out;"></div>
                  </div>
                  <div style="width: 100%; height: 16px; background: rgba(0,0,0,0.04); border-radius: 8px; margin-bottom: 8px; animation: pulse 1.5s infinite ease-in-out;"></div>
                  <div style="width: 75%; height: 16px; background: rgba(0,0,0,0.04); border-radius: 8px; animation: pulse 1.5s infinite ease-in-out;"></div>
                </div>
                <!-- Skeleton Item 2 -->
                <div style="background: rgba(255, 255, 255, 0.6); border-radius: 16px; padding: 24px; border: 1px solid rgba(13, 130, 70, 0.05); opacity: 0.7;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                    <div style="width: 100px; height: 20px; background: rgba(0,0,0,0.05); border-radius: 10px; animation: pulse 1.5s infinite ease-in-out;"></div>
                    <div style="width: 50px; height: 16px; background: rgba(0,0,0,0.04); border-radius: 8px; animation: pulse 1.5s infinite ease-in-out;"></div>
                  </div>
                  <div style="width: 90%; height: 16px; background: rgba(0,0,0,0.04); border-radius: 8px; animation: pulse 1.5s infinite ease-in-out;"></div>
                </div>
              </div>
              <style>
                @keyframes pulse {
                  0% { opacity: 0.5; }
                  50% { opacity: 1; }
                  100% { opacity: 0.5; }
                }
                .qa-card-anim {
                  animation: slideUpFade 0.4s ease-out forwards;
                  opacity: 0;
                  transform: translateY(15px);
                }
                @keyframes slideUpFade {
                  to { opacity: 1; transform: translateY(0); }
                }
              </style>"""

content = content.replace(old_loader, new_loader)

# Replace the HTML generation in JS to add the animation class and staggered delay
old_js_loop = """              let newHtml = "";
              data.data.forEach((q) => {
                const date = new Date(q.created_at);
                const time = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
                newHtml += `
                  <div style="background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); padding: 24px; border-radius: 16px; border: 1px solid rgba(13, 130, 70, 0.1); margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); transform: translateY(0); transition: transform 0.3s ease;">"""

new_js_loop = """              let newHtml = "";
              data.data.forEach((q, index) => {
                const date = new Date(q.created_at);
                const time = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
                // Calculate delay for staggered animation effect (max 5 items animate, rest are instant to prevent long delays)
                const delay = Math.min(index * 0.08, 0.4);
                newHtml += `
                  <div class="qa-card-anim" style="animation-delay: ${delay}s; background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); padding: 24px; border-radius: 16px; border: 1px solid rgba(13, 130, 70, 0.1); margin-bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">"""

content = content.replace(old_js_loop, new_js_loop)

# Also fix the fetchQuestions interval so it doesn't re-render the whole HTML every 5 seconds if the data hasn't changed!
# We can use a simple global variable to track the last data length or hash
old_fetch_start = """      async function fetchQuestions() {"""
new_fetch_start = """      let lastQuestionsLength = -1;
      async function fetchQuestions() {"""
content = content.replace(old_fetch_start, new_fetch_start)

old_data_check = """            if (data.success) {
              const list = document.getElementById("qa-list");
              if (!list) return;
  
              document.getElementById("qa-count").innerText =
                `${data.data.length} Pertanyaan`;"""

new_data_check = """            if (data.success) {
              const list = document.getElementById("qa-list");
              if (!list) return;
  
              document.getElementById("qa-count").innerText =
                `${data.data.length} Pertanyaan`;
                
              // Optimize: Don't re-render if data length hasn't changed (simple heuristic)
              if (lastQuestionsLength === data.data.length) return;
              lastQuestionsLength = data.data.length;"""
content = content.replace(old_data_check, new_data_check)


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("UI Loader optimized.")
