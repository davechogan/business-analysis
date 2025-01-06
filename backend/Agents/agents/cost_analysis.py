from openai import OpenAI

class CostAnalysis:
    def __init__(self, client: OpenAI):
        self.client = client

    def analyze(self, business_context: str, strategy: str, competitors: str, revenue: str) -> str:
        previous_analysis = f"""
        Based on previous analyses:

        Strategic Analysis:
        {strategy}

        Competitor Analysis:
        {competitors}

        Revenue Analysis:
        {revenue}
        """

        prompt = f"""
        {previous_analysis}

        Provide a detailed cost analysis for this business opportunity:

        ### Initial Costs
        • Setup and infrastructure
        • Equipment and technology
        • Legal and licensing
        • Initial staffing

        ### Operating Costs
        • Fixed costs breakdown
        • Variable costs analysis
        • Overhead expenses
        • Staffing costs

        ### Cost Structure
        • Cost drivers analysis
        • Cost optimization opportunities
        • Economies of scale
        • Cost-volume relationships

        ### Risk Factors
        • Cost volatility
        • Supply chain risks
        • Market condition impacts
        • Mitigation strategies

        ### Cost Metrics
        • Unit economics
        • Cost per acquisition
        • Operating margins
        • Efficiency ratios

        Business Context:
        {business_context}
        """

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a cost analysis expert specializing in business operations and financial planning. Format your response with ### section headers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        return response.choices[0].message.content 