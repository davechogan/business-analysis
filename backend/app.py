from flask import Flask, request, jsonify, session
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
from Agents.agents.strategy_analysis import StrategyAnalysis
from Agents.agents.revenue_analysis import RevenueAnalysis
from Agents.agents.cost_analysis import CostAnalysis
from Agents.agents.roi_analysis import ROIAnalysis
from Agents.agents.business_justification import BusinessJustification
from Agents.agents.investor_deck import InvestorDeck
from Agents.agents.competitor_analysis import CompetitorAnalysis
from format_handler import format_analysis

load_dotenv()
app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Add a secret key for session
CORS(app)

# Initialize OpenAI client and all agents
client = OpenAI()
strategy_agent = StrategyAnalysis(client)
revenue_agent = RevenueAnalysis(client)
cost_agent = CostAnalysis(client)
roi_agent = ROIAnalysis(client)
justification_agent = BusinessJustification(client)
investor_agent = InvestorDeck(client)
competitor_agent = CompetitorAnalysis(client)

@app.route('/process/strategy', methods=['POST'])
def process_strategy():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.json
        context = data.get('context', '')
        result = strategy_agent.analyze(context)
        session['strategy_analysis'] = result
        return jsonify({"result": result})
    except Exception as e:
        print(f"Strategy Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/process/competitors', methods=['POST'])
def process_competitors():
    try:
        data = request.json
        context = data.get('context', '')
        strategy = session.get('strategy_analysis', '')
        result = competitor_agent.analyze(context, strategy)
        session['competitor_analysis'] = result
        return jsonify({"result": result})
    except Exception as e:
        print(f"Competitor Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/process/revenue', methods=['POST'])
def process_revenue():
    try:
        data = request.json
        context = data.get('context', '')
        strategy = session.get('strategy_analysis', '')
        competitors = session.get('competitor_analysis', '')
        result = revenue_agent.analyze(context, strategy, competitors)
        session['revenue_analysis'] = result
        return jsonify({"result": result})
    except Exception as e:
        print(f"Revenue Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/process/cost', methods=['POST'])
def process_cost():
    try:
        data = request.json
        context = data.get('context', '')
        strategy = session.get('strategy_analysis', '')
        competitors = session.get('competitor_analysis', '')
        revenue = session.get('revenue_analysis', '')
        result = cost_agent.analyze(context, strategy, competitors, revenue)
        session['cost_analysis'] = result
        return jsonify({"result": result})
    except Exception as e:
        print(f"Cost Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/process/roi', methods=['POST'])
def process_roi():
    try:
        data = request.json
        context = data.get('context', '')
        strategy = session.get('strategy_analysis', '')
        competitors = session.get('competitor_analysis', '')
        revenue = session.get('revenue_analysis', '')
        costs = session.get('cost_analysis', '')
        result = roi_agent.analyze(
            business_context=context,
            strategy=strategy,
            competitors=competitors,
            revenue=revenue,
            costs=costs
        )
        session['roi_analysis'] = result
        return jsonify({"result": result})
    except Exception as e:
        print(f"ROI Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/process/justification', methods=['POST'])
def process_justification():
    try:
        data = request.json
        context = data.get('context', '')
        strategy = session.get('strategy_analysis', '')
        competitors = session.get('competitor_analysis', '')
        revenue = session.get('revenue_analysis', '')
        costs = session.get('cost_analysis', '')
        roi = session.get('roi_analysis', '')
        result = justification_agent.analyze(
            context, strategy, competitors, revenue, costs, roi
        )
        return jsonify({"result": result})
    except Exception as e:
        print(f"Justification Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/process/deck', methods=['POST'])
def process_deck():
    try:
        data = request.json
        context = data.get('context', '')
        strategy = session.get('strategy_analysis', '')
        competitors = session.get('competitor_analysis', '')
        revenue = session.get('revenue_analysis', '')
        costs = session.get('cost_analysis', '')
        roi = session.get('roi_analysis', '')
        result = investor_agent.analyze(
            context, strategy, competitors, revenue, costs, roi
        )
        return jsonify({"result": result})
    except Exception as e:
        print(f"Investor Deck Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 