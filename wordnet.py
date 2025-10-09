import json
from wn import Wordnet

# Load the Danish and Chinese wordnets
wn_da = Wordnet(lang='da')
wn_en = Wordnet(lang='cn')

# Prepare the list to store word pairs
word_pairs = []

# Iterate over all synsets in Danish wordnet
for synset_da in wn_da.synsets():
    # Get Danish lemmas (all lemmas in the synset, since wn_da is Danish)
    danish_lemmas = synset_da.lemmas()
    # Find the corresponding English synset using ILI (Interlingual Index)
    ili = synset_da.ili
    synsets_en = wn_en.synsets(ili=ili)
    for synset_en in synsets_en:
        # Get English lemmas (all lemmas in the synset, since wn_en is English)
        english_lemmas = synset_en.lemmas()
        # Pair each Danish lemma with each English lemma
        for danish_lemma in danish_lemmas:
            for english_lemma in english_lemmas:
                word_pairs.append({
                    "english": english_lemma,
                    "danish": danish_lemma
                })

# Save to JSON file
with open('da-cn.json', 'w', encoding='utf-8') as f:
    json.dump(word_pairs, f, ensure_ascii=False, indent=2)