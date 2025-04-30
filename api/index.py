# -*- coding: utf-8 -*-
# Removed subprocess import
import json
import re
import os
import pandas as pd
from flask import Flask, jsonify, render_template, request, abort

# Import the prediction function directly
# Use direct import as both files are in the same 'api' directory
from lotto_predictor import generate_prediction_data

# Get the absolute path of the directory where this script is located (api)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Define the path to the public folder relative to BASE_DIR (../public)
# PUBLIC_FOLDER = os.path.join(BASE_DIR, '..', 'public') # Not needed if Vercel handles public
# Define the path to the data folder relative to BASE_DIR (now inside api)
DATA_FOLDER = os.path.join(BASE_DIR, 'data')

# Initialize Flask app.
app = Flask(__name__)

# --- Configuration ---
AVAILABLE_GAMES = ["Powerball", "Mega Millions", "Cash4Life"]

# --- Helper Functions ---
def parse_hot_cold_file(game_name):
    """Parses the hot/cold analysis file for a given game."""
    analysis = {
        "hot_main": [],
        "cold_main": [],
        "hot_special": [],
        "cold_special": []
    }
    try:
        # Construct path relative to the DATA_FOLDER (now inside api)
        file_path = os.path.join(DATA_FOLDER, f"{game_name.lower().replace(' ', '_')}_hot_cold_analysis.txt")
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

            # Use regex to find the numbers after specific labels
            hot_main_match = re.search(r"Números Principais Quentes \(Top \d+\):\s*([\d, ]+)", content)
            cold_main_match = re.search(r"Números Principais Frios \(Bottom \d+\):\s*([\d, ]+)", content)
            hot_special_match = re.search(r"Números Especiais Quentes \(Top \d+\):\s*([\d, ]+)", content)
            cold_special_match = re.search(r"Números Especiais Frios \(Bottom \d+\):\s*([\d, ]+)", content)

            if hot_main_match:
                analysis["hot_main"] = [int(n.strip()) for n in hot_main_match.group(1).split(",")]
            if cold_main_match:
                analysis["cold_main"] = [int(n.strip()) for n in cold_main_match.group(1).split(",")]
            if hot_special_match:
                analysis["hot_special"] = [int(n.strip()) for n in hot_special_match.group(1).split(",")]
            if cold_special_match:
                analysis["cold_special"] = [int(n.strip()) for n in cold_special_match.group(1).split(",")]

    except FileNotFoundError:
        print(f"Warning: Analysis file not found for {game_name} at {file_path}")
    except Exception as e:
        print(f"Error parsing analysis file for {game_name}: {e}")

    return analysis

# --- Routes ---

# Route for API prediction
@app.route("/predict/<string:game_name>", methods=["GET"])
def get_prediction(game_name):
    """Endpoint to get prediction and analysis for a specific game."""
    if game_name not in AVAILABLE_GAMES:
        return jsonify({"error": f"Game \'{game_name}\' not available or not supported."}), 404

    try:
        # Call the imported function directly
        prediction_result = generate_prediction_data(game_name)

        # Check if the function returned an error dictionary
        if "error" in prediction_result:
            print(f"Prediction function error for {game_name}: {prediction_result['error']}")
            return jsonify({"error": prediction_result["error"]}), 500

        # Get hot/cold analysis
        analysis_data = parse_hot_cold_file(game_name)

        # Combine prediction and analysis
        response_data = {
            "prediction": prediction_result,
            "analysis": analysis_data
        }
        return jsonify(response_data)

    except Exception as e:
        # Catch any unexpected errors during the process
        print(f"Unexpected Error in /predict/{game_name}: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"An unexpected error occurred while generating prediction for {game_name}."}), 500

# Route for API ticket checking
@app.route("/check_ticket", methods=["POST"])
def check_ticket():
    """Endpoint to check user ticket against historical data."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400

    game_name = data.get("game")
    draw_date_str = data.get("date")
    ticket_numbers_str = data.get("numbers", "")
    special_number_str = data.get("special", "")

    if not all([game_name, draw_date_str, ticket_numbers_str]):
        return jsonify({"error": "Missing required fields: game, date, numbers."}), 400

    if game_name not in AVAILABLE_GAMES:
        return jsonify({"error": f"Game \'{game_name}\' not supported for checking."}), 400

    try:
        user_main_numbers = set(int(n.strip()) for n in ticket_numbers_str.split() if n.strip().isdigit())
        user_special_number = int(special_number_str.strip()) if special_number_str.strip().isdigit() else None
        user_draw_date = pd.to_datetime(draw_date_str).strftime("%Y-%m-%d")

        # Construct path relative to the DATA_FOLDER (now inside api)
        csv_file = os.path.join(DATA_FOLDER, f"{game_name.lower().replace(' ', '_')}_processed_camelot.csv")
        df = pd.read_csv(csv_file)

        try:
            df['Draw Date'] = pd.to_datetime(df['Draw Date'], errors='coerce').dt.strftime("%Y-%m-%d")
            df.dropna(subset=['Draw Date'], inplace=True)
        except KeyError:
             return jsonify({"error": f"Coluna 'Draw Date' não encontrada no arquivo CSV para {game_name}."}), 500

        result_row = df[df['Draw Date'] == user_draw_date]

        if result_row.empty:
            return jsonify({"message": f"Nenhum sorteio encontrado para {game_name} na data {user_draw_date}."})

        winning_row = result_row.iloc[0]
        main_numbers_col = 'Winning Numbers'
        special_number_col = None
        if game_name == 'Powerball':
            special_number_col = 'PB'
        elif game_name == 'Mega Millions':
            special_number_col = 'Mega Ball'
        elif game_name == 'Cash4Life':
             special_number_col = 'Cash Ball'

        try:
            winning_main_str = winning_row[main_numbers_col]
            winning_special_str = str(winning_row[special_number_col]) if special_number_col and special_number_col in winning_row else ''
        except KeyError as e:
             return jsonify({"error": f"Coluna esperada '{e}' não encontrada no arquivo CSV para {game_name}."}), 500

        winning_main_numbers = set(int(n.strip()) for n in str(winning_main_str).split() if n.strip().isdigit())
        winning_special_number = int(winning_special_str.strip()) if winning_special_str.strip().isdigit() else None

        main_matches = len(user_main_numbers.intersection(winning_main_numbers))
        special_match = (user_special_number is not None and winning_special_number is not None and user_special_number == winning_special_number)

        message = f"Resultado para {user_draw_date}: "
        if main_matches > 0:
            message += f"Você acertou {main_matches} número(s) principal(is)"
            if special_match:
                message += " e o número especial!"
            else:
                message += "."
        elif special_match:
            message += "Você acertou o número especial!"
        else:
            message = f"Nenhuma correspondência encontrada para o sorteio de {game_name} em {user_draw_date}."

        return jsonify({
            "message": message,
            "main_matches": main_matches,
            "special_match": special_match,
            "winning_numbers": str(winning_main_str),
            "winning_special": winning_special_str
        })

    except FileNotFoundError:
        return jsonify({"error": f"Arquivo histórico para {game_name} não encontrado em {csv_file}."}), 500
    except ValueError:
        return jsonify({"error": "Formato inválido para números ou data. Verifique os dados inseridos."}), 400
    except Exception as e:
        print(f"Error checking ticket: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Ocorreu um erro inesperado ao verificar o bilhete."}), 500

# --- Main Execution (Not needed for Vercel) ---
# if __name__ == "__main__":
#     app.run(host='0.0.0.0', port=5000)

