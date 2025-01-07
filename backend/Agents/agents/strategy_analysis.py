from openai import OpenAI

class StrategyAnalysis:
    def __init__(self, client):
        self.client = client
        self.system_role = """You are a strategic business analyst with expertise in market analysis and business strategy.
        
        Provide detailed analysis covering:
        1. Market size and growth potential
        2. Industry trends and dynamics
        3. Target market segments
        4. Competitive advantages
        5. Growth opportunities
        6. Strategic recommendations
        
        Include specific metrics and data points where relevant."""

    def process(self, context):
        custom_context = context.get('custom_context', '')
        
        prompt = f"""Based on this context, provide a comprehensive strategic analysis that includes:
        
        1. Market Opportunity Assessment
        - Market size and growth rates
        - Key market segments
        - Industry trends
        
        2. Competitive Position
        - Market dynamics
        - Entry barriers
        - Key success factors
        
        3. Strategic Recommendations
        - Growth opportunities
        - Strategic priorities
        - Key initiatives
        
        Context:
        {custom_context}
        
        Format your response with clear sections, specific metrics, and actionable insights."""

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