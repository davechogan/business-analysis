from openai import OpenAI
from .agents.format_handler import FormatHandler

class AgentHandler:
    def __init__(self):
        self.client = OpenAI()
        # ... existing agent initializations ...
        self.format_handler = FormatHandler(self.client)

    def process_request(self, endpoint: str, data: dict) -> dict:
        try:
            result = None
            
            # Get the raw result from the appropriate agent
            if endpoint == "strategy":
                raw_result = self.strategy_agent.analyze(data["context"])
                result = self.format_handler.format_analysis(raw_result)
            elif endpoint == "revenue":
                raw_result = self.revenue_agent.analyze(data["context"], data["strategy"])
                result = self.format_handler.format_analysis(raw_result)
            elif endpoint == "cost":
                raw_result = self.cost_agent.analyze(data["context"], data["strategy"], data["revenue"])
                result = self.format_handler.format_analysis(raw_result)
            elif endpoint == "roi":
                raw_result = self.roi_agent.analyze(data["context"], data["strategy"], 
                                              data["revenue"], data["cost"])
                result = self.format_handler.format_analysis(raw_result)
            elif endpoint == "justification":
                result = self.justification_agent.create_justification(data)  # Keep as is - already formatted
            elif endpoint == "deck":
                result = self.deck_agent.create_deck(data)  # Keep as is - different format
            
            if result is None:
                raise ValueError(f"Invalid endpoint: {endpoint}")

            return {"result": result}
            
        except Exception as e:
            raise Exception(f"Error processing {endpoint} request: {str(e)}") 