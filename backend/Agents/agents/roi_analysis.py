from openai import OpenAI

class ROIAnalysis:
    def __init__(self, client):
        self.client = client
        self.system_role = """You are an ROI and investment analysis expert.
        
        Focus your analysis on:
        1. Return on Investment calculations
        2. Investment requirements
        3. Payback period
        4. Risk assessment
        5. Financial metrics
        6. Investment recommendations
        
        Include specific ROI metrics, timelines, and financial projections."""

    def process(self, context):
        custom_context = context.get('custom_context', '')
        strategy_analysis = context.get('strategy', '')
        competitor_analysis = context.get('competitors', '')
        revenue_analysis = context.get('revenue', '')
        cost_analysis = context.get('cost', '')
        
        prompt = f"""Based on all previous analyses, provide a comprehensive ROI analysis that includes:
        
        1. Investment Analysis
        - Total investment required
        - Capital allocation
        - Resource requirements
        
        2. Return Projections
        - Expected ROI
        - Payback period
        - Break-even analysis
        
        3. Risk Assessment
        - Key risk factors
        - Sensitivity analysis
        - Mitigation strategies
        
        Context:
        {custom_context}
        
        Strategy Analysis:
        {strategy_analysis}
        
        Competitor Analysis:
        {competitor_analysis}
        
        Revenue Analysis:
        {revenue_analysis}
        
        Cost Analysis:
        {cost_analysis}
        
        Format your response with clear sections, specific ROI metrics, and detailed financial projections."""

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