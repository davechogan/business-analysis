from openai import OpenAI

class FormatHandler:
    def __init__(self, client: OpenAI = None):
        self.client = client or OpenAI()
        
    def format_analysis(self, text: str) -> dict:
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo-16k",
                messages=[
                    {
                        "role": "system",
                        "content": """Format this business analysis text into clear sections.
                        Extract key metrics, bullet points, and main insights.
                        Return the response in this JSON structure:
                        {
                            "sections": [
                                {
                                    "title": "section title",
                                    "content": ["paragraph 1", "paragraph 2"],
                                    "key_points": ["point 1", "point 2"],
                                    "metrics": [
                                        {"label": "metric name", "value": "value", "unit": "unit"}
                                    ]
                                }
                            ]
                        }"""
                    },
                    {"role": "user", "content": text}
                ],
                temperature=0.1
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error in format_analysis: {e}")
            return {
                "sections": [{
                    "title": "Error in Formatting",
                    "content": [str(text)],
                    "key_points": [],
                    "metrics": []
                }]
            } 