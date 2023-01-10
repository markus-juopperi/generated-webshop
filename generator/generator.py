from dalle2 import Dalle2
from gpt3 import Gpt3
import json
import random
import os

openai_apikey = os.environ['OPENAI_KEY']
dalle = Dalle2(openai_apikey) # your bearer key
gpt = Gpt3(openai_apikey) # your bearer key


adjectives = ["great", "beautiful", "excellent", "best", "good", "awesome", "useful", "superb", "fine", "superior"]
categories = ["cat", "dog", "horse", "tortoise"]
gpt_prompt = "write max 200 words description for product 'replace_me' that I can use in webshop. Only use whole sentences"

for category_index,category in enumerate(categories):
    for adjective_index,adjective in enumerate(adjectives):
        image_path =dalle.generate_and_download(adjective + " " + category)
        description = gpt.generate_and_save(gpt_prompt.replace("replace_me", adjective + " " + category), adjective + " " + category)
        json_object = {
            "product_name": adjective + "_" + category,
            "category_name": category,
            "category_id": category_index,
            "image_path": image_path,
            "description": description,
            "price": random.randint(1, 1000),
            "product_id": str(category_index) + str(adjective_index),
        }
        print(json_object)
        with open("json/" + adjective + "_" + category + ".json", "w") as outfile:
            json.dump(json_object, outfile)
