from openai import OpenAI

class RevenueAnalysis:
    def __init__(self, client):
        self.client = client
        self.system_role = """You are a revenue analysis expert.
        
        Focus your analysis on:
        1. Revenue streams and models
        2. Market size and penetration
        3. Pricing strategies
        4. Growth projections
        5. Revenue drivers
        6. Sales forecasting
        
        Include specific financial metrics and projections where possible."""

    def process(self, context):
        custom_context = context.get('custom_context', '')
        strategy_analysis = context.get('strategy', '')
        competitor_analysis = context.get('competitors', '')
        
        prompt = f"""Based on the context and previous analyses, provide a comprehensive revenue analysis that includes:
        
        1. Revenue Model Analysis
        - Revenue streams identification
        - Pricing strategy recommendations
        - Market penetration approach
        
        2. Market Opportunity
        - Total addressable market (TAM)
        - Serviceable addressable market (SAM)
        - Serviceable obtainable market (SOM)
        
        3. Revenue Projections
        - Growth assumptions
        - Sales forecasts
        - Key revenue drivers
        
        Context:
        {custom_context}
        
        Strategy Analysis:
        {strategy_analysis}
        
        Competitor Analysis:
        {competitor_analysis}
        
        Format your response with clear sections, specific financial metrics, and detailed projections."""

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