from dotenv import load_dotenv
import os

load_dotenv()

gemini_key = os.get("GEMINI_API_KEY")

def parse_input(txt):
    return {'result': 'TODO'}