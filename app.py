# -*- coding: utf-8 -*-
import subprocess
import json
import re
import os
import pandas as pd
from flask import Flask, jsonify, render_template, request, abort

# Corrected Flask app initialization (removed extra backslashes)
app = Flask(__name__, static_folder='static', static_url_path='/static')

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
        # Corrected file path formatting (removed extra backslashes)
        file_path = f"/home/ubuntu/{game_name.lower().replace(' ', '_')}_hot_cold_analysis.txt"
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
        print(f"Warning: Analysis file not found for {game_name}")
    except Exception as e:
        print(f"Error parsing analysis file for {game_name}: {e}")

    return analysis

# --- Routes ---
@app.route("/")
def index():
    """Serves the main HTML page."""
    return render_template("index.html")

@app.route("/predict/<string:game_name>", methods=["GET"])
def get_prediction(game_name):
    """Endpoint to get prediction and analysis for a specific game."""
    if game_name not in AVAILABLE_GAMES:
        # Correctly format the error message using f-string
        abort(404, description=f"Game '{game_name}' not available or not supported.") # Corrected quotes

    prediction_data = {}
    error_occurred = False
    error_message = "Prediction failed."

    try:
        # Run the predictor script
        result = subprocess.run(
            ["python3", "/home/ubuntu/lotto_predictor.py", game_name],
            capture_output=True,
            text=True,
            check=True
        )
        # Try to parse the JSON output from the script
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
        error_message = "Prediction script not found."
        print("FileNotFoundError: lotto_predictor.py not found")
    except Exception as e:
        error_occurred = True
        error_message = f"An unexpected error occurred: {e}"
        print(f"Unexpected Error: {e}")

    if error_occurred:
        return jsonify({"error": error_message}), 500
    else:
        # Get hot/cold analysis
        analysis_data = parse_hot_cold_file(game_name)
        # Combine prediction and analysis
        response_data = {
            "prediction": prediction_data.get("prediction", {}),
            "analysis": analysis_data
        }
        return jsonify(response_data)

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
        abort(400, description=f"Game '{game_name}' not supported for checking.") # Corrected quotes

    try:
        # Parse user numbers
        user_main_numbers = set(int(n.strip()) for n in ticket_numbers_str.split() if n.strip().isdigit())
        user_special_number = int(special_number_str.strip()) if special_number_str.strip().isdigit() else None

        # Format user date to match CSV (YYYY-MM-DD)
        # Important: Ensure the date format from the input matches what pd.to_datetime expects
        # Assuming input is YYYY-MM-DD from <input type="date">
        user_draw_date = pd.to_datetime(draw_date_str).strftime("%Y-%m-%d")

        # Load historical data
        # Corrected file path formatting (removed extra backslashes)
        csv_file = f"/home/ubuntu/{game_name.lower().replace(' ', '_')}_processed_camelot.csv"
        df = pd.read_csv(csv_file)

        # Ensure date column is in the correct format for comparison (YYYY-MM-DD)
        # Handle potential errors during date conversion in the CSV
        try:
            df['Draw Date'] = pd.to_datetime(df['Draw Date'], errors='coerce').dt.strftime("%Y-%m-%d")
            df.dropna(subset=['Draw Date'], inplace=True) # Remove rows where date conversion failed
        except KeyError:
             return jsonify({"error": f"Coluna 'Draw Date' não encontrada no arquivo CSV para {game_name}."}), 500

        # Find the matching draw
        result_row = df[df['Draw Date'] == user_draw_date]

        if result_row.empty:
            return jsonify({"message": f"Nenhum sorteio encontrado para {game_name} na data {user_draw_date}."})

        # Extract winning numbers from the first matching row
        winning_row = result_row.iloc[0]

        # Determine column names dynamically based on game
        main_numbers_col = 'Winning Numbers'
        special_number_col = None
        if game_name == 'Powerball':
            special_number_col = 'PB'
        elif game_name == 'Mega Millions':
            special_number_col = 'Mega Ball' # Assuming this is the column name, adjust if needed
        elif game_name == 'Cash4Life':
             special_number_col = 'Cash Ball' # Assuming this is the column name, adjust if needed

        try:
            winning_main_str = winning_row[main_numbers_col]
            winning_special_str = str(winning_row[special_number_col]) if special_number_col and special_number_col in winning_row else ''
        except KeyError as e:
             return jsonify({"error": f"Coluna esperada '{e}' não encontrada no arquivo CSV para {game_name}."}), 500

        # Parse winning numbers
        winning_main_numbers = set(int(n.strip()) for n in str(winning_main_str).split() if n.strip().isdigit())
        winning_special_number = int(winning_special_str.strip()) if winning_special_str.strip().isdigit() else None

        # Compare numbers
        main_matches = len(user_main_numbers.intersection(winning_main_numbers))
        special_match = (user_special_number is not None and winning_special_number is not None and user_special_number == winning_special_number)

        # Build result message
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
        return jsonify({"error": f"Arquivo histórico para {game_name} não encontrado."}), 500
    except ValueError:
        abort(400, description="Formato inválido para números ou data. Verifique os dados inseridos.")
    except Exception as e:
        print(f"Error checking ticket: {e}")
        import traceback
        traceback.print_exc() # Print detailed traceback for debugging
        return jsonify({"error": "Ocorreu um erro inesperado ao verificar o bilhete."}), 500

# --- Main Execution ---
if __name__ == "__main__":
    # Make sure to run on 0.0.0.0 to be accessible externally
    # Corrected host and port arguments (removed extra backslashes)
    app.run(host='0.0.0.0', port=5000)

