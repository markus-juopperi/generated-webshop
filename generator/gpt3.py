import base64
import json
import math
import os
import requests
import time
import urllib
import urllib.request

from pathlib import Path

class Gpt3():
    def __init__(self, bearer):
        self.bearer = bearer
        self.inpainting_batch_size = 3

    def generate(self, prompt):
        body = {
            "model": "text-davinci-003",
            "prompt": prompt,
            "max_tokens": 1000,
            "temperature": 0.5
        }

        return self.get_description(body)

    def generate_and_save(self, prompt, product, description_dir=os.getcwd()):
        description = self.generate(prompt)
        return self.write_to_file(description, product, description_dir)

    def get_description(self, body):
        url = "https://api.openai.com/v1/completions"
        headers = {
            'Authorization': "Bearer " + self.bearer,
            'Content-Type': "application/json",
        }

        response = requests.post(url, headers=headers, data=json.dumps(body))
        if response.status_code != 200:
            print(response.text)
            return None
        data = response.json()
 
        file1 = open("data_gpt.json", "r")
        
        # data = json.load(file1)
        print(data)
        description = data['choices'][0]['text']
        print(f"✔️ Created: {description}")
        return description
        

    def write_to_file(self, description, product, description_dir=os.getcwd()):
        description_dir = description_dir + os.path.join('/descriptions/')
        print(description_dir)
        file_path = Path(description_dir, product.replace(" ", "_")).with_suffix('.txt')
        file_path.write_text(description)
        print(f"✔️ Written: {file_path}")

        return description