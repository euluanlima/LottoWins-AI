# -*- coding: utf-8 -*-
import pandas as pd
import random
import sys
import json
# import argparse # No longer needed for direct function call
import os
from collections import Counter
from io import StringIO

# Get the absolute path of the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Define the path to the data folder relative to SCRIPT_DIR (../data)
DATA_FOLDER = os.path.join(SCRIPT_DIR, '..', 'data')

def read_frequency_data(freq_file):
    """Reads the combined frequency CSV and separates main and special ball data."""
    try:
        # Ensure the path exists before trying to open
        if not os.path.exists(freq_file):
            raise FileNotFoundError(f"Frequency file not found at {freq_file}")
        with open(freq_file, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except FileNotFoundError as e:
        # Return empty dataframes on error, let caller handle
        # print(f"Error: {e}", file=sys.stderr)
        return pd.DataFrame(columns=["Number", "Frequency"]), pd.DataFrame(columns=["Special_Number", "Frequency"])
    except Exception as e:
        # print(f"Error reading file {freq_file}: {e}", file=sys.stderr)
        return pd.DataFrame(columns=["Number", "Frequency"]), pd.DataFrame(columns=["Special_Number", "Frequency"])

    main_lines = []
    special_lines = []
    current_section = None
    header_line_main = None
    header_line_special = None
    special_col_name_base = "Special"

    # Find header lines and special ball name
    for i, line in enumerate(lines):
        line = line.strip()
        if "Main Numbers" in line and i + 1 < len(lines):
            header_line_main = lines[i+1].strip()
        elif ("Powerball" in line or "Cash Ball" in line or "Mega Ball" in line) and i + 1 < len(lines):
            header_line_special = lines[i+1].strip()
            # Extract base name (PB, CB, MB)
            try:
                special_col_name_base = header_line_special.split(",")[0].split("_")[0]
            except:
                pass # Keep default if parsing fails

    # Parse sections
    for line in lines:
        line_strip = line.strip()
        if not line_strip:
            continue
        if "Main Numbers" in line_strip:
            current_section = "main"
            if header_line_main:
                 main_lines.append(header_line_main + "\n")
            continue
        elif ("Powerball" in line_strip or "Cash Ball" in line_strip or "Mega Ball" in line_strip):
            current_section = "special"
            if header_line_special:
                special_lines.append(header_line_special + "\n")
            continue

        if current_section == "main" and line_strip != header_line_main:
            main_lines.append(line)
        elif current_section == "special" and line_strip != header_line_special:
            special_lines.append(line)

    main_freq_df = pd.DataFrame(columns=["Number", "Frequency"])
    special_freq_df = pd.DataFrame(columns=[f"{special_col_name_base}_Number", "Frequency"])

    if main_lines:
        try:
            main_freq_df = pd.read_csv(StringIO("".join(main_lines)))
            main_freq_df = main_freq_df.dropna(subset=["Number", "Frequency"])
            main_freq_df["Number"] = main_freq_df["Number"].astype(int)
            main_freq_df["Frequency"] = main_freq_df["Frequency"].astype(int)
        except Exception as e:
            # print(f"Error parsing main numbers frequency: {e}", file=sys.stderr)
            main_freq_df = pd.DataFrame(columns=["Number", "Frequency"]) # Ensure empty df

    if special_lines:
        try:
            temp_special_df = pd.read_csv(StringIO("".join(special_lines)))
            # Use the extracted base name
            special_col_name = f"{special_col_name_base}_Number"
            if special_col_name in temp_special_df.columns:
                special_freq_df = temp_special_df.dropna(subset=[special_col_name, "Frequency"])
                special_freq_df[special_col_name] = special_freq_df[special_col_name].astype(int)
                special_freq_df["Frequency"] = special_freq_df["Frequency"].astype(int)
            else:
                 # print(f"Warning: Column {special_col_name} not found in special ball data.", file=sys.stderr)
                 special_freq_df = pd.DataFrame(columns=[special_col_name, "Frequency"])
        except Exception as e:
            # print(f"Error parsing special ball frequency: {e}", file=sys.stderr)
            special_freq_df = pd.DataFrame(columns=[f"{special_col_name_base}_Number", "Frequency"]) # Ensure empty df

    return main_freq_df, special_freq_df

def predict_numbers(game, num_main, num_special):
    """Predicts lottery numbers based on frequency analysis."""
    game_file_part = game.lower().replace(" ", "_")
    # Construct path relative to the DATA_FOLDER
    freq_file = os.path.join(DATA_FOLDER, f"{game_file_part}_frequency_analysis.csv")
    main_freq, special_freq = read_frequency_data(freq_file)

    # Handle potential empty dataframes returned by read_frequency_data
    if main_freq is None or special_freq is None or main_freq.empty:
        # print(f"Frequency data incomplete or missing for {game}. Cannot predict.", file=sys.stderr)
        return None, None # Return None to indicate failure

    # Determine special ball column name from the dataframe
    special_col_name = None
    if not special_freq.empty:
        possible_cols = [col for col in special_freq.columns if col.endswith("_Number")]
        if possible_cols:
            special_col_name = possible_cols[0]

    # Weighted random choice based on frequency
    main_numbers = main_freq["Number"]
    main_weights = main_freq["Frequency"]

    # Normalize weights
    # Add 1 to avoid zero weights and handle cases with uniform frequency (like very few draws)
    main_weights_norm = (main_weights + 1) / (main_weights + 1).sum()

    predicted_main = []
    available_main = main_numbers.tolist()
    available_weights = main_weights_norm.tolist()

    if len(available_main) < num_main:
        # print(f"Warning: Not enough unique main numbers in frequency data for {game} ({len(available_main)} found, {num_main} needed). Predictions might be unreliable.", file=sys.stderr)
        # Fallback: sample with replacement if needed, or return fewer numbers
        predicted_main = random.sample(available_main, min(num_main, len(available_main)))
    else:
         # Iterative weighted sampling without replacement:
         temp_available_main = available_main[:]
         temp_available_weights = available_weights[:]
         for _ in range(num_main):
             if not temp_available_main: break
             # Ensure weights sum to 1 if normalization resulted in issues
             if not temp_available_weights or sum(temp_available_weights) <= 0:
                 # Fallback to uniform sampling if weights are invalid
                 chosen_num = random.choice(temp_available_main)
             else:
                 # Normalize again just in case of floating point issues
                 current_sum = sum(temp_available_weights)
                 if current_sum <= 0: # Avoid division by zero
                     chosen_num = random.choice(temp_available_main)
                 else:
                     normalized_weights = [w / current_sum for w in temp_available_weights]
                     chosen_num = random.choices(temp_available_main, weights=normalized_weights, k=1)[0]

             predicted_main.append(chosen_num)
             idx = temp_available_main.index(chosen_num)
             temp_available_main.pop(idx)
             temp_available_weights.pop(idx)

    predicted_main.sort()

    # Predict special number
    predicted_special = None
    if special_col_name and not special_freq.empty:
        special_numbers = special_freq[special_col_name]
        special_weights = special_freq["Frequency"]
        if not special_numbers.empty:
            special_weights_norm = (special_weights + 1) / (special_weights + 1).sum()
            if special_weights_norm.sum() > 0:
                predicted_special = random.choices(special_numbers.tolist(), weights=special_weights_norm.tolist(), k=1)[0]
            # else: print(f"Warning: Sum of special weights is zero for {game}. Cannot predict special.", file=sys.stderr)
        # else: print(f"Warning: No special numbers found for {game} after processing.", file=sys.stderr)
    # else: print(f"Warning: Could not determine or find special ball data for {game}.", file=sys.stderr)

    return predicted_main, predicted_special

# New function to be called by index.py
def generate_prediction_data(game_name):
    """Generates the prediction dictionary for a given game name."""
    num_main_balls = 0
    num_special_balls = 0
    special_ball_name = "Special"

    if game_name == "Powerball":
        num_main_balls = 5
        num_special_balls = 1
        special_ball_name = "Powerball"
    elif game_name == "Cash4Life":
        num_main_balls = 5
        num_special_balls = 1
        special_ball_name = "Cash Ball"
    elif game_name == "Mega Millions":
        num_main_balls = 5
        num_special_balls = 1
        special_ball_name = "Mega Ball"
    else:
        # Return an error dictionary if the game is unknown
        return {"error": f"Unknown game: {game_name}"}

    main_prediction, special_prediction = predict_numbers(game_name, num_main_balls, num_special_balls)

    if main_prediction is not None:
        result = {
            "game": game_name,
            "predicted_main": main_prediction,
            f"predicted_{special_ball_name.lower().replace(' ', '_')}": special_prediction
        }
        return result
    else:
        # Return an error dictionary if prediction fails
        return {"error": f"Prediction failed for {game_name}. Insufficient data?"}

# Remove the if __name__ == "__main__": block
# The script will now only define functions to be imported elsewhere

