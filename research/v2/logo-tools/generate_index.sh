#!/bin/bash

# Start building the logos index
cat > index.js << 'HEADER'
// Logo map for AI model vendors and families
// All logos are embedded as data URIs (vite-plugin-singlefile embeds them in HTML)
// Format: key → { src, kind ('symbol' or 'wordmark'), ratio, source, retrieved }

HEADER

# Process each logo file and create data URIs
for file in *.svg *.png; do
  if [ ! -f "$file" ]; then continue; fi
  
  key="${file%.*}"  # Remove extension
  ext="${file##*.}"  # Get extension
  
  # Determine MIME type
  if [ "$ext" = "svg" ]; then
    mime="image/svg+xml"
  else
    mime="image/png"
  fi
  
  # Create base64 encoded data URI
  base64_data=$(base64 < "$file" | tr -d '\n')
  data_uri="data:$mime;base64,$base64_data"
  
  # Determine kind (symbol or wordmark)
  case "$key" in
    claude|gemini|grok)
      kind="symbol"
      ;;
    anthropic|google|openai|deepseek|alibaba|qwen|xai)
      kind="wordmark"
      ;;
    *)
      kind="symbol"
      ;;
  esac
  
  # Estimate ratio (width/height) - most symbols are square
  ratio="1"
  
  # Get file size
  size=$(wc -c < "$file")
  
  # Determine source URL (from earlier fetch notes)
  case "$key" in
    deepseek)
      source_url="https://raw.githubusercontent.com/deepseek-ai/DeepSeek-V2/main/figures/logo.svg"
      ;;
    anthropic)
      source_url="https://www.anthropic.com (extracted inline)"
      ;;
    claude)
      source_url="https://claude.ai (extracted inline)"
      ;;
    gemini)
      source_url="https://www.gstatic.com/lamda/images/gemini_sparkle_4g_512_lt_f94943af3be039176192d.png"
      ;;
    google)
      source_url="https://github.com/google (org avatar)"
      ;;
    openai)
      source_url="https://github.com/openai (org avatar)"
      ;;
    xai)
      source_url="https://github.com/xai-org (org avatar)"
      ;;
    grok)
      source_url="https://github.com/xai-org (org avatar)"
      ;;
    qwen)
      source_url="https://github.com/QwenLM (org avatar)"
      ;;
    alibaba)
      source_url="(unavailable)"
      ;;
  esac
  
  # Append to index.js
  cat >> index.js << ENTRY

// $key ($ext, $size bytes)
export const logo_${key} = {
  src: '$data_uri',
  kind: '$kind',
  ratio: $ratio,
  source: '$source_url',
  retrieved: '2026-10-03'
}

ENTRY
done

# Add the logos map and helper at the end
cat >> index.js << 'FOOTER'

// Logo map: key → logo object
export const logos = {
  // Anthropic / Claude
  anthropic: typeof logo_anthropic !== 'undefined' ? logo_anthropic : null,
  claude: typeof logo_claude !== 'undefined' ? logo_claude : null,
  
  // OpenAI / GPT
  openai: typeof logo_openai !== 'undefined' ? logo_openai : null,
  gpt: null,  // Use openai as fallback
  
  // Google / Gemini
  google: typeof logo_google !== 'undefined' ? logo_google : null,
  gemini: typeof logo_gemini !== 'undefined' ? logo_gemini : null,
  
  // DeepSeek
  deepseek: typeof logo_deepseek !== 'undefined' ? logo_deepseek : null,
  
  // Alibaba / Qwen
  alibaba: typeof logo_alibaba !== 'undefined' ? logo_alibaba : null,
  qwen: typeof logo_qwen !== 'undefined' ? logo_qwen : null,
  
  // xAI / Grok
  xai: typeof logo_xai !== 'undefined' ? logo_xai : null,
  grok: typeof logo_grok !== 'undefined' ? logo_grok : null,
}

// Helper to get logo by vendor or family key, with fallback
// Resolution: familyKey → vendorKey → null
export function getLogo(familyKey, vendorKey) {
  return logos[familyKey] ?? logos[vendorKey] ?? null
}
FOOTER

echo "✓ index.js generated with data URIs"
wc -l index.js

