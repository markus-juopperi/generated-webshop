import base64
import json
import math
import os
import requests
import time
import urllib
import urllib.request

from pathlib import Path

class Dalle2():
    def __init__(self, bearer):
        self.bearer = bearer

    def generate(self, prompt, amount = 1):
        body = {
            "prompt": prompt,
            "n": amount,
            "size": "1024x1024"
        }

        return self.get_image_url(body)

    def generate_and_download(self, prompt, image_dir=os.getcwd()):
        image_url = self.generate(prompt)
        return self.download(image_url, prompt, image_dir)

    def get_image_url(self, body):
        url = "https://api.openai.com/v1/images/generations"
        headers = {
            'Authorization': "Bearer " + self.bearer,
            'Content-Type': "application/json",
        }

        response = requests.post(url, headers=headers, data=json.dumps(body))
        if response.status_code != 200:
            print(response.text)
            return None
        data = response.json()
        file1 = open("data.json", "r")
        # data = json.load(file1)
        print(data)
        image_url = data['data'][0]['url']
        print(f"✔️ Created: {image_url}")
        return image_url
        

    def download(self, image_url, prompt, image_dir=os.getcwd()):
        image_dir = image_dir + os.path.join('/pictures/')
        print(image_dir)
        file_path = Path(image_dir, prompt.replace(" ", "_")).with_suffix('.webp')
        urllib.request.urlretrieve(image_url, file_path)
        print(f"✔️ Downloaded: {file_path}")

        return "pictures/" + prompt.replace(" ", "_") + ".webp"