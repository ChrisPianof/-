#!/bin/bash

PROJECT="/Users/vadimpianof/Desktop/Claude/AlfaBank"
PKG="$PROJECT/node_modules/@alfalab/core-components/package.json"
MAP="$PROJECT/figma_code_map.md"

cd "$PROJECT" && npm install --silent

INSTALLED=$(python3 -c "import json; print(json.load(open('$PKG'))['version'])")
RECORDED=$(grep '@alfalab/core-components:' "$MAP" | sed 's/.*: //' | sed 's/ ⚠.*//' | tr -d '[:space:]')

if [ "$INSTALLED" != "$RECORDED" ]; then
  sed -i '' "s|@alfalab/core-components: [^\n]*|@alfalab/core-components: $INSTALLED ⚠ обновился с $RECORDED|" "$MAP"
  echo "$(date): @alfalab обновился $RECORDED → $INSTALLED" >> "$PROJECT/scripts/update_alfalab.log"

  # Publish to Notifier inbox (replaces ephemeral terminal-notifier banner).
  # action=open-file → нажатие «Обсудить» отдаст контекст в Claude вместе с
  # содержимым figma_code_map.md для следующего шага.
  NOTIFIER="/Users/vadimpianof/Desktop/Claude/Tools/Notifier/cli/notify"
  if [ -x "$NOTIFIER" ]; then
    printf '@alfalab/core-components обновился: %s → %s\n\nПроверь %s — там вероятны deprecated/added пропы и компоненты.\n' \
      "$RECORDED" "$INSTALLED" "$MAP" \
      | "$NOTIFIER" add \
        --source alfabank \
        --title "@alfalab обновился до $INSTALLED" \
        --summary "$RECORDED → $INSTALLED. Свериться с figma_code_map.md" \
        --priority normal \
        --action open-file \
        --payload "$MAP" \
        --id "alfabank-update-$INSTALLED" \
        || /opt/homebrew/bin/terminal-notifier -title "@alfalab обновился" -message "$RECORDED → $INSTALLED" -sound default
  else
    # Fallback на terminal-notifier если Notifier недоступен
    /opt/homebrew/bin/terminal-notifier -title "@alfalab обновился" -message "$RECORDED → $INSTALLED. Проверь figma_code_map.md" -sound default
  fi
fi
