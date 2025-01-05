from flask import jsonify
import openai

def format_analysis(text):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
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