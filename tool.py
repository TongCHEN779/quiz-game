import os
import json

FILE_NAME = "toefl"
WORD = "register"

# load data
with open(os.path.join("docs", FILE_NAME + ".json"), encoding="utf-8") as f:
    data = json.load(f)


def get_index_by_value(data, word):
    for index, item in enumerate(data):
        if item["english"] == word:
            return index
    raise ValueError("Search word not in dataset.")


index = get_index_by_value(data, WORD)

print("index   :", index)
print("english :", data[index]["english"])
print("chinese :", data[index]["chinese"])
print("hint    :", data[index]["hint"])


# TODO modify dataset
