import json
import subprocess

with open("docs/word-list.json", "r", encoding="utf-8") as f:
    data = json.load(f)

updated_data = []

for entry in data:
    english = entry["english"]
    danish = entry["danish"]
    chinese = entry["chinese"]

    prompt = f"Translate word (English: '{english}', Danish: '{danish}', Chinese: '{chinese}') into French. Output only the corresponding French translation."
    result = subprocess.run(
        ["ollama", "run", "qwen2:7b", prompt],
        capture_output=True, text=True
    )
    french = result.stdout.strip()
    print(f"English: {english}, Danish: {danish}, Chinese: {chinese}, French: {french}")
    entry["french"] = french
    updated_data.append(entry)

with open("docs/new-word-list.json", "w", encoding="utf-8") as f:
    json.dump(updated_data, f, ensure_ascii=False, indent=2)

print("✅ Done! Translations saved.")
