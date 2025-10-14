# import json
# import time
# import requests
# from pathlib import Path
# from googletrans import Translator

# INPUT_FILE = Path("docs/da-en.json")
# OUTPUT_FILE = Path("docs/da-zh.json")

# # --- You can use LibreTranslate (free public API) or your own instance ---
# TRANSLATE_URL = "https://de.libretranslate.com/"
# HEADERS = {"User-Agent": "eng-dan-zh-translator/1.0"}

# def translate_to_chinese(text):
#     """Translate English → Chinese using LibreTranslate."""
#     payload = {
#         "q": text,
#         "source": "en",
#         "target": "zh",
#         "format": "text"
#     }
#     r = requests.post(TRANSLATE_URL, data=payload, headers=HEADERS, timeout=15)
#     r.raise_for_status()
#     data = r.json()
#     return data.get("translatedText", "")

# translator = Translator()

# def translate_to_chinese(text):
#     result = translator.translate(text, src='en', dest='zh-cn')
#     return result.text

# def main():
#     # 1. Load English–Danish pairs
#     data = json.loads(INPUT_FILE.read_text(encoding="utf-8"))

#     new_data = []
#     for i, entry in enumerate(data, 1):
#         eng = entry["english"]
#         dan = entry["danish"]
#         try:
#             zh = translate_to_chinese(eng)
#         except Exception as e:
#             print(f"⚠️ Translation failed for '{eng}': {e}")
#             zh = ""
#         new_data.append({"chinese": zh, "danish": dan})
#         print(f"{i}/{len(data)} translated: {eng} → {zh}")
#         time.sleep(1.0)  # polite delay between API calls

#     # 2. Save the new Chinese–Danish pairs
#     OUTPUT_FILE.write_text(json.dumps(new_data, ensure_ascii=False, indent=2), encoding="utf-8")
#     print(f"✅ Saved {len(new_data)} Chinese–Danish pairs to {OUTPUT_FILE}")

# if __name__ == "__main__":
#     main()


# import json
# import unicodedata

# def normalize(text):
#     if not isinstance(text, str):
#         return text
#     # Normalize unicode and strip spaces/lowercase for matching
#     return unicodedata.normalize("NFKC", text).strip().lower()

# # Load both files
# with open("docs/da-en.json", "r", encoding="utf-8") as f1:
#     da_en = json.load(f1)
# with open("docs/da-cn.json", "r", encoding="utf-8") as f2:
#     da_cn = json.load(f2)

# # Build a fast lookup from normalized Danish → Chinese
# cn_dict = {normalize(e["danish"]): e["chinese"] for e in da_cn}

# # Merge in same order as da-en.json
# merged = []
# missing = 0

# for entry in da_en:
#     danish = entry["danish"]
#     english = entry["english"]
#     chinese = cn_dict.get(normalize(danish))
#     if chinese is None:
#         missing += 1
#     merged.append({
#         "english": english,
#         "chinese": chinese,
#         "danish": danish
#     })

# # Save merged file
# with open("merged.json", "w", encoding="utf-8") as f:
#     json.dump(merged, f, ensure_ascii=False, indent=2)

# print(f"✅ Merged {len(merged)} entries.")
# print(f"⚠️ Missing Chinese translations for {missing} words.")


import json
import time
from googletrans import Translator

# Files
INPUT_FILE = "docs/word-list.json"
OUTPUT_FILE = "docs/new-word-list.json"

# Parameters
SLEEP = 0.12  # seconds between requests to avoid being blocked
translator = Translator()

def bilingual_prompt(english, danish):
    """Combine English and Danish to give translator full context."""
    return f"{danish}"

# Load merged data
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

updated = 0
total = len(data)

for i, entry in enumerate(data):
    english = entry.get("english", "").strip()
    danish = entry.get("danish", "").strip()
    chinese = entry.get("chinese", "").strip()

    # Skip if translation seems valid (non-empty and not weird placeholder)
    if chinese and len(chinese) > 1:
        continue

    # Build bilingual text to translate
    query = bilingual_prompt(english, danish)

    try:
        result = translator.translate(query, src="en", dest="zh-cn")
        new_chinese = result.text.strip()
        if new_chinese and new_chinese != chinese:
            entry["chinese"] = new_chinese
            updated += 1
    except Exception as e:
        print(f"[{i}] Error translating '{query}': {e}")
        continue

    if i % 100 == 0:
        print(f"Progress: {i}/{total} ({updated} updated)")
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    time.sleep(SLEEP)

# Save final file
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Done. Updated {updated} translations out of {total}.")

