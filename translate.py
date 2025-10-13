import json
import time
import requests
from pathlib import Path
from googletrans import Translator

INPUT_FILE = Path("docs/da-en.json")
OUTPUT_FILE = Path("docs/da-zh.json")

# --- You can use LibreTranslate (free public API) or your own instance ---
TRANSLATE_URL = "https://de.libretranslate.com/"
HEADERS = {"User-Agent": "eng-dan-zh-translator/1.0"}

def translate_to_chinese(text):
    """Translate English → Chinese using LibreTranslate."""
    payload = {
        "q": text,
        "source": "en",
        "target": "zh",
        "format": "text"
    }
    r = requests.post(TRANSLATE_URL, data=payload, headers=HEADERS, timeout=15)
    r.raise_for_status()
    data = r.json()
    return data.get("translatedText", "")

translator = Translator()

def translate_to_chinese(text):
    result = translator.translate(text, src='en', dest='zh-cn')
    return result.text

def main():
    # 1. Load English–Danish pairs
    data = json.loads(INPUT_FILE.read_text(encoding="utf-8"))

    new_data = []
    for i, entry in enumerate(data, 1):
        eng = entry["english"]
        dan = entry["danish"]
        try:
            zh = translate_to_chinese(eng)
        except Exception as e:
            print(f"⚠️ Translation failed for '{eng}': {e}")
            zh = ""
        new_data.append({"chinese": zh, "danish": dan})
        print(f"{i}/{len(data)} translated: {eng} → {zh}")
        time.sleep(1.0)  # polite delay between API calls

    # 2. Save the new Chinese–Danish pairs
    OUTPUT_FILE.write_text(json.dumps(new_data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅ Saved {len(new_data)} Chinese–Danish pairs to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()


# import json

# # Load both JSON files
# with open("docs/da-en.json", "r", encoding="utf-8") as f1:
#     da_en = json.load(f1)
# with open("docs/da-cn.json", "r", encoding="utf-8") as f2:
#     da_cn = json.load(f2)

# # Use Danish as the key
# merged = {}

# # Add English–Danish pairs
# for entry in da_en:
#     danish = entry["danish"]
#     merged[danish] = {
#         "danish": danish,
#         "english": entry.get("english"),
#         "chinese": None
#     }

# # Add Chinese–Danish pairs
# for entry in da_cn:
#     danish = entry["danish"]
#     if danish in merged:
#         merged[danish]["chinese"] = entry.get("chinese")
#     else:
#         merged[danish] = {
#             "danish": danish,
#             "english": None,
#             "chinese": entry.get("chinese")
#         }

# # Convert dictionary to list
# merged_list = list(merged.values())

# # Save merged file
# with open("merged.json", "w", encoding="utf-8") as f:
#     json.dump(merged_list, f, ensure_ascii=False, indent=2)

# print("✅ Merged file saved as merged.json")
