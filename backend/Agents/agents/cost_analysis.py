from openai import OpenAI

class CostAnalysis:
    def __init__(self, client):
        self.client = client
        self.system_role = """You are a cost analysis and financial modeling expert.
        
        Focus your analysis on:
        1. Operating costs
        2. Capital requirements
        3. Cost structure analysis
        4. Resource requirements
        5. Cost optimization opportunities
        6. Financial projections
        
        Include specific cost metrics and financial data where possible."""

    def process(self, context):
        custom_context = context.get('custom_context', '')
        strategy_analysis = context.get('strategy', '')
        competitor_analysis = context.get('competitors', '')
        revenue_analysis = context.get('revenue', '')
        
        prompt = f"""Based on the context and previous analyses, provide a detailed cost analysis that includes:
        
        1. Cost Structure Analysis
        - Fixed costs identification
        - Variable costs breakdown
        - Operating expenses
        - Capital requirements
        
        2. Resource Requirements
        - Personnel needs
        - Technology infrastructure
        - Physical resources
        - Third-party services
        
        3. Financial Projections
        - Cost forecasts
        - Expense ratios
        - Optimization opportunities
        
        Context:
        {custom_context}
        
        Strategy Analysis:
        {strategy_analysis}
        
        Competitor Analysis:
        {competitor_analysis}
        
        Revenue Analysis:
        {revenue_analysis}
        
        Format your response with clear sections, specific cost metrics, and detailed financial projections."""

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