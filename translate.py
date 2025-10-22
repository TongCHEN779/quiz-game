import json
import subprocess

with open("docs/da-en.json", "r", encoding="utf-8") as f:
    data = json.load(f)

updated_data = []

for entry in data:
    english = entry["english"]
    danish = entry["danish"]

    prompt = f"Translate '{english}' (Danish: '{danish}') into Chinese. Output only the Chinese word."
    result = subprocess.run(
        ["ollama", "run", "qwen2:7b", prompt],
        capture_output=True, text=True
    )
    chinese = result.stdout.strip()
    print(f"English: {english}, Danish: {danish}, Chinese: {chinese}")
    entry["chinese"] = chinese
    updated_data.append(entry)

with open("docs/word-list.json", "w", encoding="utf-8") as f:
    json.dump(updated_data, f, ensure_ascii=False, indent=2)

print("✅ Done! Translations saved.")
