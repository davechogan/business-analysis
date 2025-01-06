from openai import OpenAI

class ROIAnalysis:
    def __init__(self, client: OpenAI):
        self.client = client

    def analyze(self, business_context: str, strategy: str, competitors: str, revenue: str, costs: str) -> str:
        previous_analysis = f"""
        Based on previous analyses:

        Strategic Analysis:
        {strategy}

        Competitor Analysis:
        {competitors}

        Revenue Analysis:
        {revenue}

        Cost Analysis:
        {costs}
        """

        prompt = f"""
        {previous_analysis}

        Provide a comprehensive ROI analysis for this business opportunity:

        ### Financial Projections
        • Investment requirements
        • Revenue forecasts
        • Cost projections
        • Cash flow analysis

        ### ROI Metrics
        • Expected ROI percentage
        • Payback period
        • Break-even analysis
        • IRR and NPV

        ### Investment Analysis
        • Capital requirements
        • Funding options
        • Investment timeline
        • Resource allocation

        ### Risk Assessment
        • Financial risks
        • Market risks
        • Operational risks
        • Mitigation strategies

        ### Performance Indicators
        • Key success metrics
        • Growth indicators
        • Efficiency metrics
        • Profitability ratios

        Business Context:
        {business_context}
        """

        response = self.client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a financial analyst specializing in ROI analysis and investment assessment. Format your response with ### section headers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        return response.choices[0].message.content 