import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print(f"Looking for .env at: {os.path.abspath('.env')}")
print(f"API Key: {os.getenv('OPENAI_API_KEY')[:10]}...")
print(f"Organization: {os.getenv('OPENAI_ORGANIZATION')}")
print(f"Project: {os.getenv('OPENAI_PROJECT')}")

# Initialize client with all available configuration including PROJECT_ID
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY'),
    organization='org-quph4ANTMjs7QVVVgoc3g9tJ',
    project='proj_0HxXkLXlRkIPLitGLM9CrjmE',
    base_url="https://api.openai.com/v1"
)

# Test connection
try:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "Say hello!"}
        ]
    )
    print("Success!")
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}") 