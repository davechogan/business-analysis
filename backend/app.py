from flask import Flask, request, jsonify
from flask_cors import CORS
from Agents.agent_handler import AgentHandler
from dotenv import load_dotenv
import os

print("\napp.py: Loading environment variables...")
load_dotenv()

# Check all OpenAI-related env vars
env_vars = {
    'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY'),
    'OPENAI_ORGANIZATION_ID': os.getenv('OPENAI_ORGANIZATION_ID'),
    'OPENAI_PROJECT_KEY': os.getenv('OPENAI_PROJECT_KEY')
}

for key, value in env_vars.items():
    if value:
        masked = f"{value[:6]}...{value[-4:]}" if value else "Not found"
        print(f"app.py: Found {key}: {masked}")
    else:
        print(f"app.py: WARNING - {key} not found")

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:8000", "http://localhost:8000"])

agent_handler = AgentHandler()
stored_context = {}

@app.route('/submit_context', methods=['POST'])
def submit_context():
    data = request.get_json()
    custom_context = data.get('custom_context', '')
    stored_context['custom_context'] = custom_context
    print(f"Received context: {custom_context}")
    return jsonify({'success': True})

@app.route('/process/<step>', methods=['POST'])
def process_step(step):
    try:
        print(f"\napp.py: Received request for step: {step}")
        data = request.get_json() or {}
        data['custom_context'] = stored_context.get('custom_context', '')
        print(f"app.py: Processing with data: {data}")
        
        print("app.py: Calling agent_handler.process_request...")
        result = agent_handler.process_request(step, data)
        print(f"app.py: Received result from agent_handler: {str(result)[:200]}...")  # First 200 chars
        
        print("app.py: Converting result to JSON...")
        json_result = jsonify(result)
        print(f"app.py: JSON result: {str(json_result.get_data())[:200]}...")  # First 200 chars
        
        print("app.py: Sending response to frontend")
        return json_result
        
    except Exception as e:
        print(f"app.py: Error processing {step}: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_formatted_result/<step>', methods=['GET'])
def get_formatted_result(step):
    result = agent_handler.get_formatted_result(step)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 