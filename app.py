# -*- coding: utf-8 -*-
import subprocess
import json
import sys
import re # Import regex module
from flask import Flask, jsonify, abort

app = Flask(__name__)

# Define the path to the predictor script
PREDICTOR_SCRIPT = "/home/ubuntu/lotto_predictor.py"

# Define available games based on processed data
AVAILABLE_GAMES = {
    "Powerball": {"main": 5, "special": 1, "special_name": "Powerball"},
    "Cash4Life": {"main": 5, "special": 1, "special_name": "Cash Ball"},
    "Mega Millions": {"main": 5, "special": 1, "special_name": "Mega Ball"}
}

def parse_hot_cold_file(game_name):
    """Reads and parses the hot/cold analysis file for a game."""
    analysis_data = {
        "hot_main": [],
        "cold_main": [],
        "hot_special": [],
        "cold_special": []
    }
    try:
        file_path = f"/home/ubuntu/{game_name.lower().replace(' ', '_')}_hot_cold_analysis.txt"
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

            # Use regex to find the numbers after specific labels
            hot_main_match = re.search(r"Top \d+ Hot Main Numbers: ([\d, ]+)", content)
            cold_main_match = re.search(r"Top \d+ Cold Main Numbers: ([\d, ]+)", content)
            hot_special_match = re.search(r"Top \d+ Hot .* Ball Numbers: ([\d, ]+)", content)
            cold_special_match = re.search(r"Top \d+ Cold .* Ball Numbers: ([\d, ]+)", content)

            if hot_main_match:
                analysis_data["hot_main"] = [int(n.strip()) for n in hot_main_match.group(1).split(",")]
            if cold_main_match:
                analysis_data["cold_main"] = [int(n.strip()) for n in cold_main_match.group(1).split(",")]
            if hot_special_match:
                analysis_data["hot_special"] = [int(n.strip()) for n in hot_special_match.group(1).split(",")]
            if cold_special_match:
                analysis_data["cold_special"] = [int(n.strip()) for n in cold_special_match.group(1).split(",")]

    except FileNotFoundError:
        print(f"Warning: Analysis file not found for {game_name}", file=sys.stderr)
        # Return empty lists if file not found
    except Exception as e:
        print(f"Error parsing analysis file for {game_name}: {e}", file=sys.stderr)
        # Return empty lists on error

    return analysis_data

@app.route("/predict/<string:game_name>", methods=["GET"])
def get_prediction(game_name):
    """Endpoint to get prediction and analysis for a specific game."""
    if game_name not in AVAILABLE_GAMES:
        abort(404, description=f"Game '{game_name}' not available or not supported.")

    prediction_data = {}
    error_occurred = False
    error_message = "Prediction failed."

    try:
        # Execute the predictor script as a subprocess
        process = subprocess.run(
            [sys.executable, PREDICTOR_SCRIPT, game_name],
            capture_output=True,
            text=True,
            check=True, # Raise exception if script fails
            encoding="utf-8"
        )
        # Parse the JSON output from the script\s stdout
        prediction_data = json.loads(process.stdout)

    except subprocess.CalledProcessError as e:
        error_occurred = True
        error_output = e.stderr
        try:
            error_json = json.loads(error_output)
            error_message = error_json.get("error", "Prediction script failed.")
        except json.JSONDecodeError:
            error_message = f"Prediction script failed: {error_output}"
    except json.JSONDecodeError:
        error_occurred = True
        error_message = "Failed to parse prediction script output."
    except Exception as e:
        error_occurred = True
        error_message = f"An unexpected error occurred during prediction: {str(e)}"

    # Get hot/cold analysis data regardless of prediction success/failure
    analysis_data = parse_hot_cold_file(game_name)

    # Combine results
    combined_data = {
        **prediction_data, # Includes game, predicted_main, predicted_special
        "analysis": analysis_data # Includes hot/cold main and special
    }

    if error_occurred:
        # Still return analysis data but include error message
        combined_data["error"] = error_message
        # Use 500 status code but return the combined data
        response = jsonify(combined_data)
        response.status_code = 500
        return response
    else:
        return jsonify(combined_data)

# Basic route to confirm the server is running and serve index.html
@app.route("/")
def index():
    try:
        return app.send_static_file("index.html")
    except FileNotFoundError:
        return "LottoWins AI Prediction Backend is running, but index.html not found in static folder."

# Route to serve other static files (CSS, JS)
@app.route("/static/<path:filename>")
def serve_static(filename):
    return app.send_static_file(filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

