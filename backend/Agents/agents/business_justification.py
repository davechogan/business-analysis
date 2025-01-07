from openai import OpenAI

class BusinessJustification:
    def __init__(self, client):
        self.client = client
        self.system_role = """You are a business case and investment justification expert.
        
        Focus your analysis on:
        1. Business opportunity
        2. Value proposition
        3. Financial justification
        4. Risk assessment
        5. Implementation roadmap
        6. Key recommendations
        
        Create a compelling business case that ties together all previous analyses."""

    def process(self, context):
        custom_context = context.get('custom_context', '')
        strategy_analysis = context.get('strategy', '')
        competitor_analysis = context.get('competitors', '')
        revenue_analysis = context.get('revenue', '')
        cost_analysis = context.get('cost', '')
        roi_analysis = context.get('roi', '')
        
        prompt = f"""Based on all previous analyses, create a comprehensive business case that includes:
        
        1. Executive Summary
        - Business opportunity
        - Value proposition
        - Key findings
        
        2. Investment Justification
        - Strategic alignment
        - Market opportunity
        - Financial benefits
        
        3. Implementation Plan
        - Key milestones
        - Resource requirements
        - Risk mitigation
        
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
        
        ROI Analysis:
        {roi_analysis}
        
        Format your response with clear sections, compelling arguments, and specific supporting data."""

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