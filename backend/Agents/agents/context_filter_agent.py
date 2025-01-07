from typing import Dict, List, Any

class ContextFilterAgent:
    def __init__(self):
        self.system_prompt = """
        You are a context filtering specialist. Your job is to:
        1. Analyze all previous agent outputs
        2. Identify key information relevant to the next task
        3. Summarize critical context
        4. Maintain important details while reducing overall size
        """

    async def process(self, previous_outputs: List[Dict[str, Any]], next_agent_type: str) -> Dict[str, Any]:
        # Filter and condense context
        # Return relevant data for next agent
