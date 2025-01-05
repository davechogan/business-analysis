from openai import OpenAI

class FormatHandler:
    def __init__(self, client: OpenAI):
        self.client = client

    def format_analysis(self, text: str) -> str:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a text formatting expert. Format the provided business analysis text to be clear, professional, and well-structured."
                    },
                    {
                        "role": "user",
                        "content": f"Please format this business analysis text:\n\n{text}"
                    }
                ],
                temperature=0.3
            )
            
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Error formatting analysis: {str(e)}") 