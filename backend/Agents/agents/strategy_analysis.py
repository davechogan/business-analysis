from openai import OpenAI

class StrategyAnalysis:
    def __init__(self, client: OpenAI):
        self.client = client

    def analyze(self, business_context: str) -> str:
        prompt = f"""
        Analyze this business opportunity and provide a strategic analysis with the following sections:

        ### Market Overview
        • Market size and growth potential
        • Key market trends
        • Industry dynamics
        • Regulatory environment

        ### Value Proposition
        • Unique selling points
        • Customer benefits
        • Competitive advantages
        • Innovation aspects

        ### Target Market
        • Customer segments
        • Market needs
        • Geographic focus
        • Market penetration strategy

        ### Growth Strategy
        • Short-term objectives
        • Long-term vision
        • Expansion opportunities
        • Potential challenges

        Business Context:
        {business_context}
        """

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a strategic business analyst with expertise in market analysis and business strategy. Format your response with ### section headers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        return response.choices[0].message.content 