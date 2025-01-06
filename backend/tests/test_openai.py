import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()



client = OpenAI(
    api_key='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',
    organization='org-quph4ANTMjs7QVVVgoc3g9tJ',
    project='proj_0HxXkLXlRkIPLitGLM9CrjmE',
    base_url="https://api.openai.com/v1",
    api_version="2024-01-01"
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