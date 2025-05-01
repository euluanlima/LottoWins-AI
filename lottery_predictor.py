import pandas as pd
import numpy as np
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder
from itertools import combinations
from datetime import datetime
import json
import sys

# Dados coletados manualmente (simulados para 50 sorteios)
lottery_data = [
    {"date": "4/29/2025", "numbers": [10, 25, 30, 45, 60], "megaBall": 15},
    {"date": "4/25/2025", "numbers": [5, 12, 22, 48, 55], "megaBall": 8},
    {"date": "4/22/2025", "numbers": [1, 19, 28, 33, 68], "megaBall": 22},
    {"date": "4/18/2025", "numbers": [7, 11, 35, 50, 61], "megaBall": 3},
    {"date": "4/15/2025", "numbers": [14, 21, 39, 44, 59], "megaBall": 1},
    {"date": "4/11/2025", "numbers": [2, 8, 15, 29, 58], "megaBall": 18},
    {"date": "4/08/2025", "numbers": [16, 23, 31, 47, 65], "megaBall": 11},
    {"date": "4/04/2025", "numbers": [4, 13, 20, 38, 51], "megaBall": 5},
    {"date": "4/01/2025", "numbers": [9, 17, 27, 41, 63], "megaBall": 14},
    {"date": "3/28/2025", "numbers": [3, 18, 24, 40, 52], "megaBall": 25},
    # ... (simulando mais 40 sorteios) ...
    {"date": "11/05/2024", "numbers": [3, 19, 32, 39, 59], "megaBall": 25}
]

class LotteryPredictor:
    def __init__(self, data):
        self.data = data
        self.df = self._prepare_dataframe()

    def _prepare_dataframe(self):
        df = pd.DataFrame(self.data)
        df['date'] = pd.to_datetime(df['date'], format='%m/%d/%Y')
        # Ensure only the last 50 draws are used if more are provided
        self.df = df.sort_values('date', ascending=False).head(50)
        return self.df

    def analyze_frequency(self):
        all_numbers = []
        for _, row in self.df.iterrows():
            all_numbers.extend(row['numbers'])
            all_numbers.append(row['megaBall'])
        freq = pd.Series(all_numbers).value_counts().sort_index()
        regular_numbers = range(1, 71)
        mega_numbers = range(1, 26)
        regular_freq = {num: freq.get(num, 0) for num in regular_numbers}
        mega_freq = {num: freq.get(num, 0) for num in mega_numbers}
        return {'regular': regular_freq, 'mega': mega_freq}

    def analyze_pairs(self):
        pair_counts = {}
        for _, row in self.df.iterrows():
            nums = row['numbers']
            for pair in combinations(nums, 2):
                pair = tuple(sorted(pair))
                pair_counts[pair] = pair_counts.get(pair, 0) + 1
        pairs_df = pd.DataFrame([
            {'pair': f"{p[0]}-{p[1]}", 'count': c, 'probability': c/len(self.df)}
            for p, c in pair_counts.items()
        ]).sort_values('count', ascending=False)
        return pairs_df

    def analyze_gaps(self):
        number_appearances = {i: [] for i in range(1, 71)}
        df_sorted = self.df.sort_values('date').reset_index()
        for idx, row in df_sorted.iterrows():
            for num in row['numbers']:
                number_appearances[num].append(idx)
        gaps = {}
        for num, appearances in number_appearances.items():
            if len(appearances) > 1:
                num_gaps = [appearances[i] - appearances[i-1] for i in range(1, len(appearances))]
                gaps[num] = {
                    'avg_gap': sum(num_gaps) / len(num_gaps),
                    'max_gap': max(num_gaps),
                    'min_gap': min(num_gaps),
                    'last_seen': len(self.df) - 1 - appearances[-1] if appearances else len(self.df)
                }
            elif len(appearances) == 1:
                 gaps[num] = {
                    'avg_gap': len(self.df), # Treat as if it appeared only once long ago
                    'max_gap': len(self.df),
                    'min_gap': len(self.df),
                    'last_seen': len(self.df) - 1 - appearances[0]
                }
        return gaps

    def generate_predictions(self, num_combinations=5):
        freq = self.analyze_frequency()
        pairs = self.analyze_pairs().head(20)
        gaps = self.analyze_gaps()

        scores = {}
        for num in range(1, 71):
            freq_score = freq['regular'].get(num, 0) / len(self.df)
            gap_score = 0
            if num in gaps:
                last_seen = gaps[num]['last_seen']
                avg_gap = gaps[num]['avg_gap']
                if avg_gap > 0 and last_seen > avg_gap: # Avoid division by zero
                    gap_score = min(1.0, last_seen / (2 * avg_gap))
            elif freq['regular'].get(num, 0) == 0: # Penalize numbers that never appeared
                 gap_score = 0.1 # Small boost for very overdue numbers (never seen)
            scores[num] = 0.6 * freq_score + 0.4 * gap_score

        mega_scores = {}
        for num in range(1, 26):
            mega_scores[num] = freq['mega'].get(num, 0) / len(self.df)

        combinations_list = []
        sorted_numbers = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        sorted_mega = sorted(mega_scores.items(), key=lambda x: x[1], reverse=True)

        # --- Refined Confidence Logic --- 
        # Define thresholds based on score distribution (e.g., quantiles)
        all_scores = list(scores.values())
        if not all_scores:
             return [] # Return empty if no scores
        
        high_threshold = np.percentile(all_scores, 75) if all_scores else 0 # Top 25%
        medium_threshold = np.percentile(all_scores, 40) if all_scores else 0 # Top 60%

        # --- Combination Generation Logic (Simplified & Diversified) ---
        generated_sets = set()
        while len(combinations_list) < num_combinations:
            # Strategy 1: Focus on high-scoring numbers
            base_numbers = [n for n, s in sorted_numbers if s >= high_threshold]
            if len(base_numbers) >= 5:
                chosen_numbers = np.random.choice(base_numbers, 5, replace=False)
            else: # Fallback if not enough high-scoring numbers
                chosen_numbers = np.random.choice([n for n,s in sorted_numbers[:15]], 5, replace=False)
            
            chosen_numbers.sort()
            numbers_tuple = tuple(chosen_numbers)

            if numbers_tuple not in generated_sets:
                # Select Mega Ball based on score
                top_mega = [m for m, s in sorted_mega[:5]]
                mega = np.random.choice(top_mega) if top_mega else np.random.randint(1, 26)
                
                # Determine confidence based on the scores of chosen numbers
                avg_score = np.mean([scores.get(n, 0) for n in chosen_numbers])
                confidence = "Alta" if avg_score >= high_threshold else ("Média" if avg_score >= medium_threshold else "Baixa")

                combinations_list.append({
                    'numbers': list(chosen_numbers),
                    'megaBall': mega,
                    'confidence': confidence
                })
                generated_sets.add(numbers_tuple)
            
            # Add more strategies if needed to ensure diversity and reach num_combinations
            if len(combinations_list) == num_combinations:
                 break

            # Strategy 2: Include some medium/lower scoring numbers for diversity
            if len(sorted_numbers) >= 10:
                 mix_numbers = np.random.choice([n for n,s in sorted_numbers[5:20]], 2, replace=False) # Pick 2 medium/low
                 high_numbers = np.random.choice([n for n,s in sorted_numbers[:5]], 3, replace=False) # Pick 3 high
                 chosen_numbers = np.concatenate((mix_numbers, high_numbers))
                 chosen_numbers.sort()
                 numbers_tuple = tuple(chosen_numbers)
                 if numbers_tuple not in generated_sets and len(chosen_numbers) == 5:
                    top_mega = [m for m, s in sorted_mega[:5]]
                    mega = np.random.choice(top_mega) if top_mega else np.random.randint(1, 26)
                    avg_score = np.mean([scores.get(n, 0) for n in chosen_numbers])
                    confidence = "Alta" if avg_score >= high_threshold else ("Média" if avg_score >= medium_threshold else "Baixa")
                    combinations_list.append({
                        'numbers': list(chosen_numbers),
                        'megaBall': mega,
                        'confidence': confidence
                    })
                    generated_sets.add(numbers_tuple)

            # Break if stuck in loop (should not happen with diverse strategies)
            if len(generated_sets) > num_combinations * 5: 
                break 

        return combinations_list[:num_combinations]

if __name__ == "__main__":
    num_combinations = 10
    if len(sys.argv) > 1:
        try:
            num_combinations = int(sys.argv[1])
        except ValueError:
            # Keep default if argument is not a valid integer
            pass
            
    # Adicionar mais dados simulados para chegar a 50
    while len(lottery_data) < 50:
        # Gerar dados aleatórios plausíveis (apenas para completar os 50)
        prev_date_str = lottery_data[-1]['date']
        prev_date = datetime.strptime(prev_date_str, '%m/%d/%Y')
        # Simular sorteio anterior (3-4 dias antes)
        new_date = prev_date - pd.Timedelta(days=np.random.randint(3, 5))
        new_numbers = sorted(np.random.choice(range(1, 71), 5, replace=False).tolist())
        new_mega = np.random.randint(1, 26)
        lottery_data.append({
            'date': new_date.strftime('%m/%d/%Y'),
            'numbers': new_numbers,
            'megaBall': new_mega
        })

    predictor = LotteryPredictor(lottery_data)
    predictions = predictor.generate_predictions(num_combinations=num_combinations)
    
    # Output predictions as JSON string to stdout
    print(json.dumps(predictions, indent=2))

