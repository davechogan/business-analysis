from openai import OpenAI
import json

client = None

def get_client():
    global client
    if client is None:
        client = OpenAI()
    return client

def format_analysis(text):
    try:
        # Just return the text in a simple structure
        return {
            "sections": [
                {
                    "content": text
                }
            ]
        }
    except Exception as e:
        print(f"Error formatting analysis: {e}")
        return {"error": str(e)} 