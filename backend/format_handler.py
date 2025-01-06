from openai import OpenAI
from flask import jsonify

client = None

def get_client():
    global client
    if client is None:
        client = OpenAI()  # This will use OPENAI_API_KEY from environment
    return client

def format_analysis(text):
    try:
        # If we're using mock data, we don't need the OpenAI client
        if hasattr(format_analysis, 'USE_MOCK') and format_analysis.USE_MOCK:
            return text

        # Only get the client when we need it
        client = get_client()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are a text formatting expert. Your job is to take business analysis text and structure it into clear, well-organized sections.
                    
                    Rules:
                    1. Identify main topics and create logical sections
                    2. Extract key metrics and data points
                    3. Highlight important conclusions
                    4. Maintain the original meaning and facts
                    5. Format numbers consistently
                    6. Group related information together
                    
                    Return the formatted result as JSON with this structure:
                    {
                        "sections": [
                            {
                                "title": "section title",
                                "content": ["paragraph 1", "paragraph 2"],
                                "key_points": ["key point 1", "key point 2"],
                                "metrics": [
                                    {
                                        "label": "metric name",
                                        "value": "numeric value",
                                        "unit": "unit of measurement"
                                    }
                                ]
                            }
                        ]
                    }"""
                },
                {
                    "role": "user",
                    "content": f"Please format this business analysis text:\n\n{text}"
                }
            ],
            temperature=0.3
        )
        
        return jsonify(response.choices[0].message.content)
    except Exception as e:
        print(f"Error formatting analysis: {e}")
        return jsonify({"error": str(e)}), 500 