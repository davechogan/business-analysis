class AgentChain:
    def __init__(self):
        self.context_filter = ContextFilterAgent()
        self.formatting_agent = FormattingAgent()
        self.raw_outputs = []  # Store all raw outputs

    async def process_chain(self, initial_data):
        for agent in self.agents:
            # Store raw output
            raw_output = await agent.process(initial_data)
            self.raw_outputs.append(raw_output)

            # Filter context for next agent
            filtered_context = await self.context_filter.process(
                self.raw_outputs,
                type(self.agents[next_index]).__name__
            )

            # Update context for next agent
            initial_data = filtered_context

        # Format final output for frontend
        formatted_output = await self.formatting_agent.process(self.raw_outputs[-1])
        
        return {
            'formatted_output': formatted_output,
            'raw_outputs': self.raw_outputs  # Keep raw data for reference
        }
