import os
from pathlib import Path
from openai import OpenAI, version
from dotenv import load_dotenv

def test_openai_connection():
    # Print OpenAI package version
    print(f"\nOpenAI package version: {version.VERSION}")
    
    # Load .env from the Agents directory using relative path
    backend_dir = Path(__file__).parent.parent
    dotenv_path = backend_dir / 'Agents' / '.env'
    load_dotenv(dotenv_path)

    # Initialize OpenAI client without organization parameter
    client = OpenAI(
        api_key=os.getenv('OPENAI_API_KEY')
    )

    try:
        # Match the exact pattern from your working agents
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a test analyst."},
                {"role": "user", "content": "Say hello!"}
            ],
            temperature=0.7
        )
        print("\nOpenAI Connection Test:")
        print(response.choices[0].message.content)
        return True
    except Exception as e:
        print(f"\nTest failed with error: {str(e)}")
        return False

if __name__ == "__main__":
    test_openai_connection() 