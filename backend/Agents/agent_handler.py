from openai import OpenAI
from dotenv import load_dotenv
import os
from .agents.strategy_analysis import StrategyAnalysis
from .agents.competitor_analysis import CompetitorAnalysis
from .agents.revenue_analysis import RevenueAnalysis
from .agents.cost_analysis import CostAnalysis
from .agents.roi_analysis import ROIAnalysis
from .agents.business_justification import BusinessJustification
from .agents.investor_deck import InvestorDeck

# Load environment variables
load_dotenv()

class AgentHandler:
    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OpenAI API key not found in environment variables")
            
        self.client = OpenAI(api_key=api_key)
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
            
        # Update context with input data if it contains custom_context
        if 'custom_context' in data:
            self.context['custom_context'] = data['custom_context']
            
        # Get response from the agent
        agent = self.agents[step]
        result = agent.process(self.context)
        
        # Store the result in context for next agents
        self.context[step] = result
        
        return result 