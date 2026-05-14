#!/usr/bin/env python3
import json
import re
import sys

data = json.load(sys.stdin)
command = data.get('tool_input', {}).get('command', '')

if 'npm install' not in command:
    sys.exit(0)

pkg_path = '/Users/vadimpianof/Desktop/Claude/AlfaBank/node_modules/@alfalab/core-components/package.json'
map_path = '/Users/vadimpianof/Desktop/Claude/AlfaBank/figma_code_map.md'

try:
    with open(pkg_path) as f:
        installed = json.load(f)['version']
except Exception:
    sys.exit(0)

try:
    with open(map_path) as f:
        content = f.read()
except Exception:
    sys.exit(0)

match = re.search(r'@alfalab/core-components: ([0-9][^\s⚠\n]+)', content)
if not match:
    sys.exit(0)

recorded = match.group(1)
if installed == recorded:
    sys.exit(0)

new_content = re.sub(
    r'@alfalab/core-components: [^\n]+',
    f'@alfalab/core-components: {installed} ⚠ обновился с {recorded}',
    content
)
with open(map_path, 'w') as f:
    f.write(new_content)

print(f'⚠ @alfalab/core-components обновился: {recorded} → {installed}. Проверь figma_code_map.md — маппинги могли устареть.')
