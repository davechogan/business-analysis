from flask import Flask, request, jsonify
from flask_cors import CORS
from Agents.agent_handler import AgentHandler

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
        data = request.get_json() or {}
        data['custom_context'] = stored_context.get('custom_context', '')
        print(f"Processing {step} with data: {data}")
        result = agent_handler.process_request(step, data)
        return jsonify(result)
    except Exception as e:
        print(f"Error processing {step}: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 