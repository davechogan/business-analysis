import os
import sys
from pathlib import Path

# Add debug prints
print("Current working directory:", os.getcwd())

# Add the backend directory to the Python path using relative path
backend_dir = Path(__file__).parent.parent
print("Backend directory:", backend_dir)
sys.path.append(str(backend_dir))

from openai import OpenAI
from dotenv import load_dotenv

# Load .env from the Agents directory using relative path
dotenv_path = backend_dir / 'Agents' / '.env'
print("Looking for .env at:", dotenv_path)
print(".env exists:", dotenv_path.exists())

load_dotenv(dotenv_path)
print("OPENAI_API_KEY exists:", bool(os.getenv('OPENAI_API_KEY')))

from Agents.agents.competitor_analysis import CompetitorAnalysis

def test_competitor_analysis():
    # Initialize OpenAI client with both API key and organization
    client = OpenAI(
        api_key=os.getenv('OPENAI_API_KEY'),
        organization=os.getenv('OPENAI_ORGANIZATION')
    )
    
    # Create agent
    agent = CompetitorAnalysis(client)
    
    # Test context
    business_context = "A new electric vehicle charging station network"
    previous_results = {
        'strategy': """
        ### Market Analysis
        • Growing EV market
        • High demand for charging infrastructure
        """
    }
    
    # Run analysis
    try:
        result = agent.analyze(business_context, previous_results)
        print("\nTest successful! Agent response:")
        print(result)
        return True
    except Exception as e:
        print(f"\nTest failed with error: {str(e)}")
        return False

if __name__ == "__main__":
    test_competitor_analysis() 