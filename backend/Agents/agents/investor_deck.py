from openai import OpenAI

class InvestorDeck:
    def __init__(self, client):
        self.client = client
        self.system_role = """You are a presentation and executive communication expert.
        
        Focus on creating a compelling investor deck that:
        1. Tells a clear story
        2. Highlights key opportunities
        3. Presents financial potential
        4. Addresses risks and mitigation
        5. Shows clear implementation path
        6. Drives investment decision
        
        Create a structured presentation outline that synthesizes all previous analyses."""

    def process(self, context):
        custom_context = context.get('custom_context', '')
        strategy_analysis = context.get('strategy', '')
        competitor_analysis = context.get('competitors', '')
        revenue_analysis = context.get('revenue', '')
        cost_analysis = context.get('cost', '')
        roi_analysis = context.get('roi', '')
        business_justification = context.get('justification', '')
        
        prompt = f"""Based on all previous analyses, create a compelling investor deck outline that includes:
        
        1. Executive Overview
        - Business opportunity
        - Market potential
        - Value proposition
        
        2. Market & Strategy
        - Market analysis
        - Competitive landscape
        - Strategic positioning
        
        3. Financial Opportunity
        - Revenue model
        - Cost structure
        - ROI projections
        
        4. Investment Case
        - Capital requirements
        - Use of funds
        - Expected returns
        
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
        
        Business Justification:
        {business_justification}
        
        Format your response as a clear presentation outline with key points and supporting data for each slide."""

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