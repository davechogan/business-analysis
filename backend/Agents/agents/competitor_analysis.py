from typing import Dict, Optional
from .base_agent import BaseAgent
from openai import OpenAI

class CompetitorAnalysis(BaseAgent):
    def __init__(self, client: OpenAI):
        super().__init__(client, 'competitors')

    def analyze(self, business_context: str, previous_results: Optional[Dict[str, str]] = None) -> str:
        prompt = f"""
        Analyze the competitive landscape for this business opportunity. Format your response with ### section headers followed by bullet points (•).

        Use this exact structure:

        ### Market Competition Overview
        • Point 1
        • Point 2
        etc.

        ### Direct Competitors
        • **Competitor 1**: Description
        • **Competitor 2**: Description
        etc.

        ### Competitive Positioning
        • **Price Points**: Details
        • **Quality**: Details
        etc.

        ### Competitor Capabilities
        • **Manufacturing**: Details
        • **R&D**: Details
        etc.

        ### Competitive Strategy
        • **Market Entry**: Details
        • **Differentiation**: Details
        etc.

        Business Context:
        {business_context}
        """

        return self._generate_response(prompt, previous_results) 