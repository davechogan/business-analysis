from openai import OpenAI
from dotenv import load_dotenv
import os
from .agents.format_handler import FormatHandler
from .agents.strategy_analysis import StrategyAnalysis
from .agents.competitor_analysis import CompetitorAnalysis
from .agents.revenue_analysis import RevenueAnalysis
from .agents.cost_analysis import CostAnalysis
from .agents.roi_analysis import ROIAnalysis
from .agents.business_justification import BusinessJustification
from .agents.investor_deck import InvestorDeck

class AgentHandler:
    def __init__(self):
        print("\nagent_handler.py: Initializing AgentHandler...")
        
        # Check all OpenAI-related env vars
        env_vars = {
            'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY'),
            'OPENAI_ORGANIZATION_ID': os.getenv('OPENAI_ORGANIZATION_ID'),
            'OPENAI_PROJECT_KEY': os.getenv('OPENAI_PROJECT_KEY')
        }

        for key, value in env_vars.items():
            if value:
                masked = f"{value[:6]}...{value[-4:]}" if value else "Not found"
                print(f"agent_handler.py: Found {key}: {masked}")
            else:
                print(f"agent_handler.py: WARNING - {key} not found")
        
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OpenAI API key not found in environment variables")
            
        self.client = OpenAI(
            api_key=api_key,
            organization=os.getenv('OPENAI_ORGANIZATION_ID')
        )
        print("agent_handler.py: Successfully created OpenAI client")
        self.formatter = FormatHandler(self.client)
        self.agents = {
            'strategy': StrategyAnalysis(self.client),
            'competitors': CompetitorAnalysis(self.client),
            'revenue': RevenueAnalysis(self.client),
            'cost': CostAnalysis(self.client),
            'roi': ROIAnalysis(self.client),
            'justification': BusinessJustification(self.client),
            'deck': InvestorDeck(self.client)
        }
        self.context = {}

    def process_request(self, step, data):
        if step not in self.agents:
            return {"error": f"Unknown step: {step}"}
        
        # Get response from the agent
        agent = self.agents[step]
        raw_result = agent.process(self.context)
        
        # Store raw result in context
        self.context[step] = raw_result
        
        # Format the result - it should already be in the correct JSON structure
        formatted_result = self.formatter.format_analysis(raw_result)
        
        # The formatter already returns the correct structure, so just return it
        return formatted_result 