from openai import OpenAI

class FormatHandler:
    def __init__(self, client: OpenAI = None):
        self.client = client or OpenAI()
        
    def format_analysis(self, text: str) -> dict:
        print(f"\nformat_handler.py: Starting formatting")
        print(f"format_handler.py: Received text length: {len(text)}")
        print(f"format_handler.py: First 200 chars: {text[:200]}...")
        
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
            
            result = response.choices[0].message.content
            print(f"format_handler.py: Formatting complete")
            print(f"format_handler.py: Result first 200 chars: {result[:200]}...")
            return result
            
        except Exception as e:
            print(f"format_handler.py: Error in formatting: {e}")
            return {
                "sections": [{
                    "title": "Error in Formatting",
                    "content": [str(text)],
                    "key_points": [],
                    "metrics": []
                }]
            } 