import requests
import json
import re


# Base URLs
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/open-dict-data/wikidict-zh/master/data/"
GITHUB_API_CONTENTS = "https://api.github.com/repos/open-dict-data/wikidict-zh/contents/data"

def load_common_chinese_chars(filepath="top5000cn.txt"):
    """Load common Chinese characters from a file, all in one line."""
    chars = set()
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read().strip()
            for char in content:
                if char:
                    chars.add(char)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
    return chars

COMMON_CHINESE_CHARS = load_common_chinese_chars()

def is_common_chinese(word):
    # Heuristic: word is short (<=4 chars), and all chars are in common set
    return len(word) <= 4 and all(c in COMMON_CHINESE_CHARS for c in word)

def is_common_danish(word):
    # Heuristic: word is short (<=10 chars), and only contains alphabetic chars
    return len(word) <= 10 and word.isalpha()

def find_da_zh_filename():
    """List files in the data/ directory and find one starting with da-zh_ or zh-da_ or similar."""
    resp = requests.get(GITHUB_API_CONTENTS)
    resp.raise_for_status()
    items = resp.json()
    for it in items:
        name = it.get("name", "")
        if name.startswith("da-zh") or name.startswith("zh-da"):
            return name
    return None

def download_and_parse(filename):
    url = GITHUB_RAW_BASE + filename
    resp = requests.get(url)
    resp.encoding = "utf-8"
    if resp.status_code != 200:
        raise Exception(f"Failed to download file: {resp.status_code} for {url}")
    lines = resp.text.strip().splitlines()
    data = []
    for line in lines:
        parts = line.split("\t")
        if len(parts) >= 2:
            src = parts[0].strip()
            tgt = parts[1].strip()
            tgt = re.sub(r"\[.*?\]", "", tgt)
            src = re.sub(r"\[.*?\]", "", src)
            if src and tgt:
                if filename.startswith("da-zh"):
                    danish = src
                    chinese = tgt
                else:
                    chinese = src
                    danish = tgt
                # Filter for common, popular, short words
                if is_common_chinese(chinese) and is_common_danish(danish):
                    data.append({"chinese": chinese, "danish": danish})
    return data

def fetch_chinese_danish_pairs(limit=None):
    filename = find_da_zh_filename()
    if filename is None:
        raise Exception("Could not find a Danish ↔ Chinese file in repository")
    print("Found file:", filename)
    pairs = download_and_parse(filename)
    if limit:
        pairs = pairs[:limit]
    return pairs

if __name__ == "__main__":
    pairs = fetch_chinese_danish_pairs()
    with open("chinese_danish.json", "w", encoding="utf-8") as f:
        json.dump(pairs, f, ensure_ascii=False, indent=2)
    print("Done. Sample entries:")
    for e in pairs[:5]:
        print(e)
