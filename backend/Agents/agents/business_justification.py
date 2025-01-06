from openai import OpenAI

class BusinessJustification:
    def __init__(self, client: OpenAI):
        self.client = client

    def analyze(self, business_context: str, strategy: str, competitors: str, revenue: str, costs: str, roi: str) -> str:
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

        ROI Analysis:
        {roi}
        """

        prompt = f"""
        {previous_analysis}

        Provide a comprehensive business justification for this opportunity:

        ### Executive Summary
        • Business opportunity overview
        • Market potential
        • Competitive advantage
        • Financial highlights

        ### Strategic Fit
        • Market alignment
        • Growth potential
        • Competitive positioning
        • Core capabilities

        ### Financial Viability
        • Revenue potential
        • Cost structure
        • ROI analysis
        • Risk assessment

        ### Implementation Plan
        • Key milestones
        • Resource requirements
        • Timeline
        • Success metrics

        ### Recommendations
        • Go/No-go assessment
        • Key considerations
        • Critical success factors
        • Next steps

        Business Context:
        {business_context}
        """

        response = self.client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a senior business advisor specializing in business case development and strategic planning. Format your response with ### section headers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        return response.choices[0].message.content 