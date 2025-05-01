from flask import Flask, request, jsonify
import sys
import os

# Add the directory containing lottery_predictor to the Python path
# Vercel runs the script from the root, so api/ is the path
script_dir = os.path.dirname(__file__)
sys.path.append(script_dir)

# Now import the function from lottery_predictor
try:
    from lottery_predictor import generate_predictions
except ImportError as e:
    # Provide a helpful error message if the import fails
    def generate_predictions(*args, **kwargs):
        raise ImportError(f"Failed to import generate_predictions from lottery_predictor.py in {script_dir}. Error: {e}")

app = Flask(__name__)

@app.route("/api/predict", methods=["GET"])
def predict_handler():
    num_combinations = request.args.get("num", default=10, type=int)
    # Assuming generate_predictions doesn't need a file path anymore
    # If it does, we need to adjust how the data file is accessed in Vercel
    try:
        predictions = generate_predictions(num_combinations=num_combinations)
        return jsonify(predictions)
    except Exception as e:
        # Log the error for debugging on Vercel
        print(f"Error executing prediction script: {e}", file=sys.stderr)
        return jsonify({"error": "Failed to execute prediction script."}), 500

# Vercel expects the Flask app instance to be named 'app'
# No need for app.run() as Vercel handles the server

