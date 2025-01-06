from openai import OpenAI

class RevenueAnalysis:
    def __init__(self, client: OpenAI):
        self.client = client

    def analyze(self, business_context: str, strategy: str, competitors: str) -> str:
        previous_analysis = f"""
        Based on previous analyses:

        Strategic Analysis:
        {strategy}

        Competitor Analysis:
        {competitors}
        """

        prompt = f"""
        {previous_analysis}

        Provide a detailed revenue analysis for this business opportunity:

        ### Revenue Streams
        • Primary revenue sources
        • Revenue model analysis
        • Pricing strategy
        • Market size impact

        ### Growth Projections
        • Year 1-3 projections
        • Growth drivers
        • Market penetration rates
        • Scaling factors

        ### Revenue Risks
        • Market risks
        • Competition impact
        • Economic factors
        • Mitigation strategies

        ### Revenue Optimization
        • Upsell opportunities
        • Cross-sell potential
        • Customer lifetime value
        • Revenue diversification

        ### Key Metrics
        • Customer acquisition cost
        • Average revenue per user
        • Churn rate projections
        • Break-even analysis

        Business Context:
        {business_context}
        """

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a financial analyst specializing in revenue modeling and business forecasting. Format your response with ### section headers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        return response.choices[0].message.content 