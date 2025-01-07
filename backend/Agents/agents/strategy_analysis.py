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
        print(f"\nstrategy_analysis.py: Starting analysis")
        print(f"strategy_analysis.py: Received context keys: {list(context.keys())}")
        print(f"strategy_analysis.py: Custom context: {context.get('custom_context', 'None')}")
        
        # Create a more specific prompt with the user's input
        user_input = context.get('custom_context', '')
        if not user_input:
            print("strategy_analysis.py: WARNING - No custom context found!")
            return "Error: No business concept provided for analysis."
        
        prompt = f"""Analyze this specific business concept in detail: {user_input}

        Provide a strategic analysis covering:
        1. Market size and potential
        2. Target customer segments
        3. Competition and market dynamics
        4. Growth opportunities
        5. Key success factors
        6. Strategic recommendations

        Focus specifically on this business concept, not generic analysis."""
        
        messages = [
            {"role": "system", "content": self.system_role},
            {"role": "user", "content": prompt}
        ]
        
        print("strategy_analysis.py: Sending to OpenAI with prompt:", prompt)
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7
        )
        
        result = response.choices[0].message.content
        print(f"strategy_analysis.py: Received response, first 200 chars: {result[:200]}...")
        return result 