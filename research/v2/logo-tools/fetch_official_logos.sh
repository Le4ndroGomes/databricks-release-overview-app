#!/bin/bash

UA_FULL="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

echo "=== Fetching Official Logos ==="
echo ""

# 1. DeepSeek (confirmed accessible)
echo "1. DeepSeek (from official repo)..."
curl -s -L \
  "https://raw.githubusercontent.com/deepseek-ai/DeepSeek-V2/main/figures/logo.svg" \
  -o deepseek.svg
if [ -s deepseek.svg ] && head -1 deepseek.svg | grep -q "svg"; then
  echo "   ✓ deepseek.svg ($(wc -c < deepseek.svg) bytes)"
else
  rm -f deepseek.svg
  echo "   ✗ Failed"
fi

# 2. Anthropic (extract inline from HTML)
echo "2. Anthropic (from homepage HTML)..."
curl -s -L -H "User-Agent: $UA_FULL" \
  "https://www.anthropic.com" \
  > /tmp/anthropic.html
# Try to extract inline SVG logo from anthropic.com
if grep -o '<svg[^>]*>.*</svg>' /tmp/anthropic.html | head -1 > /tmp/anthropic_logo.svg 2>/dev/null; then
  if [ -s /tmp/anthropic_logo.svg ]; then
    # Clean up and save
    cp /tmp/anthropic_logo.svg anthropic.svg
    echo "   ✓ anthropic.svg ($(wc -c < anthropic.svg) bytes, inline from homepage)"
  fi
fi
rm -f /tmp/anthropic.html

# 3. Claude (try claude.ai or claude.com)
echo "3. Claude (from claude.ai)..."
curl -s -L -H "User-Agent: $UA_FULL" \
  "https://claude.ai" \
  > /tmp/claude.html
# Extract logo
if grep -o '<svg[^>]*class="[^"]*logo[^"]*"[^>]*>.*?</svg>' /tmp/claude.html | head -1 > /tmp/claude_logo.svg 2>/dev/null; then
  if [ -s /tmp/claude_logo.svg ]; then
    cp /tmp/claude_logo.svg claude.svg
    echo "   ✓ claude.svg ($(wc -c < claude.svg) bytes, from claude.ai)"
  fi
fi
if [ ! -f claude.svg ]; then
  # Try claude.com
  curl -s -L -H "User-Agent: $UA_FULL" \
    "https://claude.com" \
    > /tmp/claude.html
  if grep -o '<img[^>]*src="[^"]*logo[^"]*"' /tmp/claude.html | head -1 > /tmp/claude_img.txt 2>/dev/null; then
    CLAUDE_IMG_URL=$(grep -o 'src="[^"]*logo[^"]*"' /tmp/claude_img.txt | head -1 | cut -d'"' -f2)
    if [ -n "$CLAUDE_IMG_URL" ]; then
      curl -s -L -H "User-Agent: $UA_FULL" \
        "$CLAUDE_IMG_URL" \
        -o /tmp/claude_img.$(echo "$CLAUDE_IMG_URL" | rev | cut -d. -f1 | rev)
      if [ -s /tmp/claude_img.* ]; then
        cp /tmp/claude_img.* claude.png || cp /tmp/claude_img.* claude.svg
        echo "   ✓ claude.$(ls -1 /tmp/claude_img.* | rev | cut -d. -f1 | rev) (from claude.com)"
      fi
    fi
  fi
fi
rm -f /tmp/claude.html /tmp/claude_img*

# 4. Gemini (from gstatic.com via gemini.google.com)
echo "4. Gemini (from gemini.google.com HTML)..."
curl -s -L -H "User-Agent: $UA_FULL" \
  "https://gemini.google.com" \
  > /tmp/gemini.html
# Extract gstatic URL for Gemini logo
GEMINI_URL=$(grep -o 'https://www.gstatic.com/[^"]*gemini[^"]*\(svg\|png\)' /tmp/gemini.html | head -1)
if [ -n "$GEMINI_URL" ]; then
  EXT="${GEMINI_URL##*.}"
  curl -s -L -H "User-Agent: $UA_FULL" \
    "$GEMINI_URL" \
    -o "gemini.$EXT"
  if [ -s "gemini.$EXT" ]; then
    echo "   ✓ gemini.$EXT (from $GEMINI_URL)"
  fi
fi
rm -f /tmp/gemini.html

# 5. Qwen (from qwen.ai)
echo "5. Qwen (from qwen.ai HTML)..."
curl -s -L -H "User-Agent: $UA_FULL" \
  "https://qwen.ai" \
  > /tmp/qwen.html
# Extract logo URL
QWEN_LOGO_URL=$(grep -o 'src="[^"]*qwen[^"]*\(logo\|icon\)[^"]*"' /tmp/qwen.html | head -1 | cut -d'"' -f2)
if [ -n "$QWEN_LOGO_URL" ]; then
  # Handle relative URLs
  if [[ "$QWEN_LOGO_URL" == /* ]]; then
    QWEN_LOGO_URL="https://qwen.ai$QWEN_LOGO_URL"
  fi
  EXT="${QWEN_LOGO_URL##*.}"
  EXT="${EXT%%\?*}"  # Remove query params
  curl -s -L -H "User-Agent: $UA_FULL" \
    "$QWEN_LOGO_URL" \
    -o "qwen.$EXT"
  if [ -s "qwen.$EXT" ]; then
    echo "   ✓ qwen.$EXT (from qwen.ai)"
  fi
fi
rm -f /tmp/qwen.html

# 6. Grok (try with full headers)
echo "6. Grok (from x.ai with browser headers)..."
curl -s -L -H "User-Agent: $UA_FULL" \
  -H "Accept: text/html,application/xhtml+xml" \
  -H "Accept-Language: en-US,en;q=0.9" \
  -H "Sec-Fetch-Dest: document" \
  -H "Sec-Fetch-Mode: navigate" \
  "https://x.ai/grok" \
  > /tmp/grok.html
# Try to extract logo
GROK_LOGO=$(grep -o '<img[^>]*src="[^"]*grok[^"]*"' /tmp/grok.html | head -1 | cut -d'"' -f2)
if [ -n "$GROK_LOGO" ]; then
  if [[ "$GROK_LOGO" == /* ]]; then
    GROK_LOGO="https://x.ai$GROK_LOGO"
  fi
  EXT="${GROK_LOGO##*.}"
  EXT="${EXT%%\?*}"
  curl -s -L -H "User-Agent: $UA_FULL" \
    "$GROK_LOGO" \
    -o "grok.$EXT"
  if [ -s "grok.$EXT" ]; then
    echo "   ✓ grok.$EXT (from x.ai)"
  fi
fi
rm -f /tmp/grok.html

# 7. OpenAI (try with full headers, then fallback to GitHub avatar)
echo "7. OpenAI (trying openai.com with browser headers)..."
curl -s -L \
  -H "User-Agent: $UA_FULL" \
  -H "Accept: text/html,application/xhtml+xml" \
  -H "Sec-Fetch-Dest: document" \
  "https://openai.com" \
  > /tmp/openai.html
# Try to find logo
OPENAI_LOGO=$(grep -o 'src="[^"]*openai[^"]*\(logo\|icon\|mark\)[^"]*"' /tmp/openai.html | head -1 | cut -d'"' -f2)
if [ -n "$OPENAI_LOGO" ]; then
  if [[ "$OPENAI_LOGO" == /* ]]; then
    OPENAI_LOGO="https://openai.com$OPENAI_LOGO"
  fi
  EXT="${OPENAI_LOGO##*.}"
  EXT="${EXT%%\?*}"
  curl -s -L "$OPENAI_LOGO" -o "openai.$EXT"
  if [ -s "openai.$EXT" ]; then
    echo "   ✓ openai.$EXT (from openai.com)"
  fi
fi

# Fallback to GitHub avatar for OpenAI
if [ ! -f openai.* ]; then
  echo "   → Trying GitHub org avatar for OpenAI..."
  curl -s -L \
    "https://avatars.githubusercontent.com/u/14957082?s=460" \
    -o openai.png
  if [ -s openai.png ] && file openai.png | grep -q PNG; then
    echo "   ✓ openai.png (from GitHub org avatar)"
  else
    rm -f openai.png
  fi
fi
rm -f /tmp/openai.html

# 8. Google (try with headers)
echo "8. Google (trying google.com with browser headers)..."
curl -s -L -H "User-Agent: $UA_FULL" \
  "https://google.com" \
  > /tmp/google.html
# Extract logo if available
GOOGLE_LOGO=$(grep -o 'src="[^"]*logo[^"]*"' /tmp/google.html | head -1 | cut -d'"' -f2)
if [ -n "$GOOGLE_LOGO" ]; then
  if [[ "$GOOGLE_LOGO" == /* ]]; then
    GOOGLE_LOGO="https://google.com$GOOGLE_LOGO"
  fi
  EXT="${GOOGLE_LOGO##*.}"
  EXT="${EXT%%\?*}"
  curl -s -L "$GOOGLE_LOGO" -o "google.$EXT"
  if [ -s "google.$EXT" ]; then
    echo "   ✓ google.$EXT (from google.com)"
  fi
fi

# Fallback to GitHub avatar for Google
if [ ! -f google.* ]; then
  echo "   → Trying GitHub org avatar for Google..."
  curl -s -L \
    "https://avatars.githubusercontent.com/u/1342004?s=460" \
    -o google.png
  if [ -s google.png ] && file google.png | grep -q PNG; then
    echo "   ✓ google.png (from GitHub org avatar)"
  else
    rm -f google.png
  fi
fi
rm -f /tmp/google.html

# 9. Alibaba (try with headers)
echo "9. Alibaba (trying alibaba.com)..."
curl -s -L -H "User-Agent: $UA_FULL" \
  "https://www.alibaba.com" \
  > /tmp/alibaba.html
ALIBABA_LOGO=$(grep -o 'src="[^"]*alibaba[^"]*\(logo\|mark\)[^"]*"' /tmp/alibaba.html | head -1 | cut -d'"' -f2)
if [ -n "$ALIBABA_LOGO" ]; then
  if [[ "$ALIBABA_LOGO" == /* ]]; then
    ALIBABA_LOGO="https://www.alibaba.com$ALIBABA_LOGO"
  fi
  EXT="${ALIBABA_LOGO##*.}"
  EXT="${EXT%%\?*}"
  curl -s -L "$ALIBABA_LOGO" -o "alibaba.$EXT"
  if [ -s "alibaba.$EXT" ]; then
    echo "   ✓ alibaba.$EXT (from alibaba.com)"
  fi
fi
rm -f /tmp/alibaba.html

# 10. xAI (try with headers, fallback to GitHub)
echo "10. xAI (trying x.ai with browser headers)..."
curl -s -L -H "User-Agent: $UA_FULL" \
  -H "Sec-Fetch-Dest: document" \
  "https://x.ai" \
  > /tmp/xai.html
XAI_LOGO=$(grep -o 'src="[^"]*\(xai\|x-ai\)[^"]*"' /tmp/xai.html | head -1 | cut -d'"' -f2)
if [ -n "$XAI_LOGO" ]; then
  if [[ "$XAI_LOGO" == /* ]]; then
    XAI_LOGO="https://x.ai$XAI_LOGO"
  fi
  EXT="${XAI_LOGO##*.}"
  EXT="${EXT%%\?*}"
  curl -s -L "$XAI_LOGO" -o "xai.$EXT"
  if [ -s "xai.$EXT" ]; then
    echo "   ✓ xai.$EXT (from x.ai)"
  fi
fi

# Fallback to GitHub avatar for xAI
if [ ! -f xai.* ]; then
  echo "   → Trying GitHub org avatar for xAI..."
  curl -s -L \
    "https://avatars.githubusercontent.com/u/119032473?s=460" \
    -o xai.png
  if [ -s xai.png ] && file xai.png | grep -q PNG; then
    echo "   ✓ xai.png (from GitHub org avatar)"
  else
    rm -f xai.png
  fi
fi
rm -f /tmp/xai.html

echo ""
echo "=== Summary ==="
ls -lh *.svg *.png 2>/dev/null | awk '{print $9 " (" $5 ")"}'
echo ""
