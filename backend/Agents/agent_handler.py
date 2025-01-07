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
from concurrent.futures import ThreadPoolExecutor

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
        self.formatting_tasks = {}
        self.executor = ThreadPoolExecutor(max_workers=3)  # Allow 3 concurrent formatting tasks

    def process_request(self, step, data):
        print(f"\nagent_handler.py: Processing step: {step}")
        print(f"agent_handler.py: Current context keys: {list(self.context.keys())}")
        print(f"agent_handler.py: Incoming data: {data}")
        
        if step not in self.agents:
            return {"error": f"Unknown step: {step}"}
        
        # Update context with incoming data
        if 'custom_context' in data:
            self.context['custom_context'] = data['custom_context']
        
        # Get response from the agent
        agent = self.agents[step]
        print(f"agent_handler.py: Calling {step} agent with context: {self.context}")
        raw_result = agent.process(self.context)
        
        print(f"agent_handler.py: Got raw result from {step}")
        print(f"agent_handler.py: First 200 chars: {raw_result[:200]}...")
        
        # Store raw result in context
        self.context[step] = raw_result
        print(f"agent_handler.py: Updated context keys: {list(self.context.keys())}")
        
        # Start formatting
        future = self.executor.submit(
            self.formatter.format_analysis,
            raw_result
        )
        self.formatting_tasks[step] = future
        
        return {
            "status": "processing",
            "raw_result": raw_result,
            "step": step
        }

    def get_formatted_result(self, step):
        """Check if formatting is complete and return result"""
        if step not in self.formatting_tasks:
            return {"error": "No formatting task found for this step"}
            
        future = self.formatting_tasks[step]
        
        if future.done():
            try:
                formatted_result = future.result()
                del self.formatting_tasks[step]  # Cleanup completed task
                return {
                    "status": "complete",
                    "formatted_result": formatted_result
                }
            except Exception as e:
                return {"error": f"Formatting failed: {str(e)}"}
        else:
            return {"status": "processing"}

    def __del__(self):
        """Cleanup executor on deletion"""
        self.executor.shutdown(wait=False) 