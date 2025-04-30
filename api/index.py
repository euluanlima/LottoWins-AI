# -*- coding: utf-8 -*-
import subprocess
import json
import re
import os
import pandas as pd
from flask import Flask, jsonify, render_template, request, abort

# Get the absolute path of the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Define the path to the public folder relative to BASE_DIR (../public)
PUBLIC_FOLDER = os.path.join(BASE_DIR, '..', 'public')
# Define the path to the data folder relative to BASE_DIR (../data)
DATA_FOLDER = os.path.join(BASE_DIR, '..', 'data')

# Initialize Flask app, pointing static folder to the new 'public' directory
app = Flask(__name__, static_folder=PUBLIC_FOLDER, static_url_path='/static')

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
        # Construct path relative to the DATA_FOLDER
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
# Route for serving the main HTML page (now from public folder)
@app.route("/")
def index():
    """Serves the main HTML page."""
    # Render the index.html from the 'public' folder (Flask automatically looks here due to static_folder setting)
    # However, for the root route, we usually render a template. Let's assume index.html is treated as a template.
    # If index.html is purely static, Vercel's routing might handle it directly.
    # For Flask to serve it from the root, we might need to adjust Vercel routes or serve it explicitly.
    # Let's keep render_template for now, assuming it's in a templates folder *inside* public, or adjust later.
    # For Vercel deployment, it's often better to let Vercel handle static file serving.
    # Let's adjust Flask to NOT serve static files from root, Vercel will handle it.
    # We only need Flask for API routes.
    # So, we remove the render_template call here.
    # Vercel will serve public/index.html for the root path.
    # We need to adjust vercel.json if this is the case.
    # Let's revert for now and assume Flask serves index.html from a 'templates' folder *within* 'public'
    # This requires moving index.html to public/templates/index.html
    # Let's simplify: Assume index.html is in 'public' and Flask serves API endpoints only.
    # The root route in Flask might not be needed if Vercel serves public/index.html directly.
    # Let's comment out the root route for now and rely on Vercel's static serving.
    # return render_template("index.html") # Assuming index.html is in a 'templates' folder
    pass # Or return a simple API confirmation

# Route for API prediction
@app.route("/predict/<string:game_name>", methods=["GET"])
def get_prediction(game_name):
    """Endpoint to get prediction and analysis for a specific game."""
    if game_name not in AVAILABLE_GAMES:
        abort(404, description=f"Game '{game_name}' not available or not supported.")

    prediction_data = {}
    error_occurred = False
    error_message = "Prediction failed."

    try:
        # Construct path to the predictor script within the api directory
        predictor_script_path = os.path.join(BASE_DIR, "lotto_predictor.py")
        result = subprocess.run(
            ["python3", predictor_script_path, game_name],
            capture_output=True,
            text=True,
            check=True,
            cwd=BASE_DIR # Ensure the script runs with the api directory as cwd
        )
        try:
            prediction_data = json.loads(result.stdout)
        except json.JSONDecodeError:
            error_occurred = True
            error_message = "Failed to decode prediction script output."
            print(f"JSONDecodeError: Output was: {result.stdout}")

    except subprocess.CalledProcessError as e:
        error_occurred = True
        error_message = f"Prediction script failed: {e}"
        print(f"CalledProcessError: {e}")
        print(f"Stderr: {e.stderr}")
    except FileNotFoundError:
        error_occurred = True
        error_message = f"Prediction script not found at {predictor_script_path}."
        print(f"FileNotFoundError: {predictor_script_path} not found")
    except Exception as e:
        error_occurred = True
        error_message = f"An unexpected error occurred: {e}"
        print(f"Unexpected Error: {e}")

    if error_occurred:
        return jsonify({"error": error_message}), 500
    else:
        analysis_data = parse_hot_cold_file(game_name)
        response_data = {
            "prediction": prediction_data.get("prediction", {}),
            "analysis": analysis_data
        }
        return jsonify(response_data)

# Route for API ticket checking
@app.route("/check_ticket", methods=["POST"])
def check_ticket():
    """Endpoint to check user ticket against historical data."""
    data = request.get_json()
    if not data:
        abort(400, description="Invalid request data.")

    game_name = data.get("game")
    draw_date_str = data.get("date")
    ticket_numbers_str = data.get("numbers", "")
    special_number_str = data.get("special", "")

    if not all([game_name, draw_date_str, ticket_numbers_str]):
        abort(400, description="Missing required fields: game, date, numbers.")

    if game_name not in AVAILABLE_GAMES:
        abort(400, description=f"Game '{game_name}' not supported for checking.")

    try:
        user_main_numbers = set(int(n.strip()) for n in ticket_numbers_str.split() if n.strip().isdigit())
        user_special_number = int(special_number_str.strip()) if special_number_str.strip().isdigit() else None
        user_draw_date = pd.to_datetime(draw_date_str).strftime("%Y-%m-%d")

        # Construct path relative to the DATA_FOLDER
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
        abort(400, description="Formato inválido para números ou data. Verifique os dados inseridos.")
    except Exception as e:
        print(f"Error checking ticket: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Ocorreu um erro inesperado ao verificar o bilhete."}), 500

# --- Main Execution (Not needed for Vercel) ---
# if __name__ == "__main__":
#     app.run(host='0.0.0.0', port=5000)

