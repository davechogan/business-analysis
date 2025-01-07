from openai import OpenAI

class CompetitorAnalysis:
    def __init__(self, client):
        self.client = client
        self.system_role = """You are a competitive intelligence expert.
        
        Analyze competitors focusing on:
        1. Market share and positioning
        2. Strengths and weaknesses
        3. Product/service offerings
        4. Pricing strategies
        5. Competitive advantages
        6. Market strategies
        
        Provide specific examples and data points where possible."""

    def process(self, context):
        custom_context = context.get('custom_context', '')
        strategy_analysis = context.get('strategy', '')
        
        prompt = f"""Based on the context and strategy analysis, provide a detailed competitive analysis that includes:
        
        1. Competitor Landscape
        - Key competitors identification
        - Market share analysis
        - Positioning comparison
        
        2. Competitive Analysis
        - Strengths and weaknesses
        - Product/service comparison
        - Pricing strategies
        - Go-to-market approaches
        
        3. Competitive Advantages
        - Key differentiators
        - Market opportunities
        - Potential threats
        
        Context:
        {custom_context}
        
        Strategy Analysis:
        {strategy_analysis}
        
        Format your response with clear sections, competitor comparisons, and specific insights."""

        messages = [
            {"role": "system", "content": self.system_role},
            {"role": "user", "content": prompt}
        ]

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7
        )

        return response.choices[0].message.content 