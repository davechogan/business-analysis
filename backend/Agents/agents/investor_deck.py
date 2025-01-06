from openai import OpenAI

class InvestorDeck:
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

        Create a compelling investor deck outline with the following sections:

        ### Executive Summary
        • Vision and mission
        • Problem statement
        • Solution overview
        • Investment opportunity

        ### Market Opportunity
        • Market size and growth
        • Target segments
        • Industry trends
        • Competitive landscape

        ### Business Model
        • Revenue streams
        • Cost structure
        • Value proposition
        • Growth strategy

        ### Financial Projections
        • Revenue forecasts
        • Cost analysis
        • ROI metrics
        • Funding requirements

        ### Investment Proposition
        • Use of funds
        • Growth milestones
        • Exit strategy
        • Risk mitigation

        Business Context:
        {business_context}
        """

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert in creating investor presentations and pitch decks. Format your response with ### section headers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        return response.choices[0].message.content 