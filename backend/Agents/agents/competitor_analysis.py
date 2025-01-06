from openai import OpenAI

class CompetitorAnalysis:
    def __init__(self, client: OpenAI):
        self.client = client

    def analyze(self, business_context: str, strategy: str = None) -> str:
        strategy_context = f"""
        Based on the previous strategic analysis:
        {strategy}
        """ if strategy else ""

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
        {strategy_context}
        """

        response = self.client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a competitive intelligence expert. Always format your response with ### section headers followed by bullet points."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        return response.choices[0].message.content 