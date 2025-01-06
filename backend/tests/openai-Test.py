import openai
import os
from dotenv import load_dotenv

# Load API key from .env file
print("Loading .env file...")

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    print("API key not found! Check your .env file or environment variables.")
    exit(1) 

print(f"API Key: {openai.api_key}")


# Test the connection with a simple API call
try:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Tell me a joke."},
        ],
    )
    print(response.choices[0].message['content'])
    print(f"Response: {response}")
except openai.error.OpenAIError as e:
    print(f"Error connecting to OpenAI: {e}")
