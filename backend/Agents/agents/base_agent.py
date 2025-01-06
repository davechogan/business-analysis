from typing import Dict, Optional
from openai import OpenAI
from config.ai_models import AI_CONFIG

class BaseAgent:
    def __init__(self, client: OpenAI, agent_type: str):
        self.client = client
        self.agent_type = agent_type
        self.config = AI_CONFIG[agent_type]
    
    def _get_context_from_dependencies(self, previous_results: Dict[str, str]) -> str:
        """Build context from dependent analyses"""
        context = ""
        for dep in self.config['dependencies']:
            if dep in previous_results:
                context += f"\n### Previous {dep.title()} Analysis:\n{previous_results[dep]}\n"
        return context

    def _generate_response(self, prompt: str, previous_results: Optional[Dict[str, str]] = None) -> str:
        # Build context from dependencies
        context = self._get_context_from_dependencies(previous_results or {})
        
        # Add context to prompt if there are dependencies
        full_prompt = f"{prompt}\n{context}" if context else prompt

        response = self.client.chat.completions.create(
            model=self.config['model'],
            messages=[
                {"role": "system", "content": self.config['system_role']},
                {"role": "user", "content": full_prompt}
            ],
            temperature=self.config['temperature']
        )
        return response.choices[0].message.content 