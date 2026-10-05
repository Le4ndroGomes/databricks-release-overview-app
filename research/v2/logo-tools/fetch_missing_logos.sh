#!/bin/bash

UA_FULL="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

echo "=== Attempting Missing Logos ==="

# 1. Claude - try GitHub anthropics org
echo "1. Claude (anthropics/anthropic-sdk GitHub)..."
curl -s -L "https://api.github.com/repos/anthropics/anthropic-sdk-python/contents" \
  | grep -o '"download_url":"[^"]*logo[^"]*"' | head -1
# Try direct repo search
curl -s -L "https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/README.md" > /tmp/claude_readme.md
if grep -o '!\[.*\](.*logo.*[png|svg])' /tmp/claude_readme.md | head -1; then
  CLAUDE_URL=$(grep -o '!\[.*\](.*logo.*[png|svg])' /tmp/claude_readme.md | head -1 | cut -d'(' -f2 | cut -d')' -f1)
  if [ -n "$CLAUDE_URL" ]; then
    curl -s -L "$CLAUDE_URL" -o claude.$(echo "$CLAUDE_URL" | rev | cut -d. -f1 | rev)
    if [ -s claude.* ]; then
      echo "   ✓ claude.$(ls -1 claude.* 2>/dev/null | rev | cut -d. -f1 | rev)"
    fi
  fi
fi
rm -f /tmp/claude_readme.md

# Fallback: extract from claude.ai page with more aggressive parsing
if [ ! -f claude.* ]; then
  echo "   → Trying aggressive parsing of claude.ai..."
  curl -s -L -H "User-Agent: $UA_FULL" "https://claude.ai" | \
    grep -o '<svg[^>]*>.*</svg>' | grep -i 'logo\|mark\|symbol' | head -1 > /tmp/claude_logo.svg 2>/dev/null
  if [ -s /tmp/claude_logo.svg ]; then
    cp /tmp/claude_logo.svg claude.svg
    echo "   ✓ claude.svg (inline SVG)"
  fi
fi

# 2. Qwen - try QwenLM GitHub
echo "2. Qwen (QwenLM GitHub)..."
curl -s -L "https://raw.githubusercontent.com/QwenLM/Qwen/main/assets/logo.png" -o qwen.png
if [ -s qwen.png ] && file qwen.png | grep -q PNG; then
  echo "   ✓ qwen.png (from QwenLM GitHub assets)"
else
  rm -f qwen.png
  # Try other asset names
  for ASSET in qwen_logo.png Qwen-logo-simple.png qwen-logo.png; do
    curl -s -L "https://raw.githubusercontent.com/QwenLM/Qwen/main/assets/$ASSET" -o "qwen_test.png" 2>/dev/null
    if [ -s "qwen_test.png" ] && file qwen_test.png | grep -q PNG; then
      mv qwen_test.png qwen.png
      echo "   ✓ qwen.png (from QwenLM/$ASSET)"
      break
    fi
  done
  rm -f qwen_test.png
fi

# Try Alibaba Cloud repo
if [ ! -f qwen.png ]; then
  echo "   → Trying Alibaba Cloud assets..."
  curl -s -L "https://raw.githubusercontent.com/aliyun/alibabacloud-python-sdk/main/README.md" | \
    grep -o 'https://[^"]*qwen[^"]*\(png\|svg\|jpg\)' | head -1 > /tmp/qwen_url.txt
  if [ -s /tmp/qwen_url.txt ]; then
    QWEN_URL=$(cat /tmp/qwen_url.txt)
    curl -s -L "$QWEN_URL" -o qwen.${QWEN_URL##*.}
    if [ -s qwen.* ]; then
      echo "   ✓ qwen.$(ls -1 qwen.* | rev | cut -d. -f1 | rev)"
    fi
  fi
fi

# 3. Grok - try x.ai/grok page with image extraction
echo "3. Grok (x.ai/news or grok page)..."
for PAGE in "https://x.ai/grok" "https://x.ai/news/grok-4-7" "https://x.ai"; do
  echo "   Trying $PAGE..."
  curl -s -L -H "User-Agent: $UA_FULL" "$PAGE" | \
    grep -o 'src="[^"]*grok[^"]*\(png\|jpg\|svg\|webp\)"' | head -1 > /tmp/grok_src.txt
  if [ -s /tmp/grok_src.txt ]; then
    GROK_IMG=$(cat /tmp/grok_src.txt | cut -d'"' -f2)
    if [[ "$GROK_IMG" == /* ]]; then
      GROK_IMG="https://x.ai$GROK_IMG"
    elif [[ ! "$GROK_IMG" == http* ]]; then
      GROK_IMG="https://x.ai/$GROK_IMG"
    fi
    EXT="${GROK_IMG##*.}"
    EXT="${EXT%%\?*}"
    curl -s -L -H "User-Agent: $UA_FULL" "$GROK_IMG" -o "grok.$EXT" 2>/dev/null
    if [ -s "grok.$EXT" ]; then
      echo "   ✓ grok.$EXT"
      break
    fi
  fi
done
rm -f /tmp/grok_src.txt /tmp/grok_url.txt

# Try xAI GitHub org for Grok
if [ ! -f grok.* ]; then
  echo "   → Trying xai-org GitHub..."
  curl -s -L "https://api.github.com/repos/xai-org/grok-1/contents" 2>/dev/null | \
    grep -o '"download_url":"[^"]*grok[^"]*\(png\|svg\|jpg\)"' | head -1 > /tmp/grok_url.txt
  if [ -s /tmp/grok_url.txt ]; then
    GROK_URL=$(cat /tmp/grok_url.txt | cut -d'"' -f4)
    curl -s -L "$GROK_URL" -o grok.${GROK_URL##*.}
    if [ -s grok.* ]; then
      echo "   ✓ grok.$(ls -1 grok.* | rev | cut -d. -f1 | rev)"
    fi
  fi
fi

# 4. Alibaba - try alibabacloud
echo "4. Alibaba (alibabacloud.com)..."
curl -s -L -H "User-Agent: $UA_FULL" "https://www.alibabacloud.com" | \
  grep -o 'src="[^"]*alibaba[^"]*\(logo\|mark\)[^"]*"' | head -1 > /tmp/alibaba_src.txt
if [ -s /tmp/alibaba_src.txt ]; then
  ALIBABA_IMG=$(cat /tmp/alibaba_src.txt | cut -d'"' -f2)
  if [[ "$ALIBABA_IMG" == /* ]]; then
    ALIBABA_IMG="https://www.alibabacloud.com$ALIBABA_IMG"
  fi
  EXT="${ALIBABA_IMG##*.}"
  EXT="${EXT%%\?*}"
  curl -s -L "$ALIBABA_IMG" -o "alibaba.$EXT"
  if [ -s "alibaba.$EXT" ]; then
    echo "   ✓ alibaba.$EXT"
  fi
fi
rm -f /tmp/alibaba_src.txt /tmp/alibaba_url.txt

echo ""
echo "=== Final Status ==="
ls -lh *.svg *.png 2>/dev/null | awk '{print "✓ " $9 " (" $5 ")"}'
ls -1 *.svg *.png 2>/dev/null | wc -l | awk '{print "   Total: " $1 " logos"}'

