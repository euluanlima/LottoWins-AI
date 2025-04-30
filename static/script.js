document.addEventListener("DOMContentLoaded", () => {
    const gameSelect = document.getElementById("game-select");
    const predictButton = document.getElementById("predict-button");
    const predictionOutputDiv = document.getElementById("prediction-output");
    const smartPickInfoDiv = document.getElementById("smart-pick-info");
    const loadingIndicator = document.getElementById("loading");
    const errorMessageDiv = document.getElementById("error-message");

    // Elements for hot/cold numbers
    const hotNumbersSpan = document.getElementById("hot-numbers");
    const coldNumbersSpan = document.getElementById("cold-numbers");
    const hotSpecialSpan = document.getElementById("hot-special");
    const coldSpecialSpan = document.getElementById("cold-special");

    predictButton.addEventListener("click", async () => {
        const selectedGame = gameSelect.value;

        if (!selectedGame) {
            errorMessageDiv.textContent = "Por favor, selecione um jogo de loteria.";
            errorMessageDiv.style.display = "block";
            predictionOutputDiv.innerHTML = "<p>Selecione um jogo e clique em \"Gerar Smart Pick\".</p>";
            smartPickInfoDiv.style.display = "none"; // Hide analysis
            return;
        }

        // Clear previous messages and results
        errorMessageDiv.style.display = "none";
        predictionOutputDiv.innerHTML = ""; // Clear previous prediction
        smartPickInfoDiv.style.display = "none"; // Hide analysis initially
        loadingIndicator.style.display = "block";

        try {
            // Make API call to the Flask backend
            const response = await fetch(`/predict/${encodeURIComponent(selectedGame)}`);
            const data = await response.json(); // Try to parse JSON regardless of status

            // Check for errors in the response data or status code
            if (!response.ok || data.error) {
                throw new Error(data.error || `Erro: ${response.status} ${response.statusText}`);
            }

            // --- Display Prediction --- 
            let predictionHTML = `<h3>Previsão Smart Pick</h3>`;
            if (data.predicted_main && data.predicted_main.length > 0) {
                predictionHTML += `<p><strong>Números Principais:</strong> <span class="numbers">${data.predicted_main.join(", ")}</span></p>`;
                // Find the special ball key (e.g., predicted_powerball, predicted_cash_ball)
                const specialBallKey = Object.keys(data).find(key => key.startsWith("predicted_") && key !== "predicted_main");
                if (specialBallKey && data[specialBallKey] !== null) {
                    const specialBallName = specialBallKey.replace("predicted_", "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                    predictionHTML += `<p><strong>${specialBallName}:</strong> <span class="numbers">${data[specialBallKey]}</span></p>`;
                } else {
                     predictionHTML += `<p><strong>Bola Especial:</strong> (Não disponível)</p>`;
                }
            } else {
                predictionHTML += `<p>Não foi possível gerar a previsão principal.</p>`;
            }
            predictionOutputDiv.innerHTML = predictionHTML;

            // --- Display Analysis (Hot/Cold) --- 
            if (data.analysis) {
                hotNumbersSpan.textContent = data.analysis.hot_main?.join(", ") || "--";
                coldNumbersSpan.textContent = data.analysis.cold_main?.join(", ") || "--";
                hotSpecialSpan.textContent = data.analysis.hot_special?.join(", ") || "--";
                coldSpecialSpan.textContent = data.analysis.cold_special?.join(", ") || "--";
                smartPickInfoDiv.style.display = "block"; // Show analysis section
            } else {
                 smartPickInfoDiv.style.display = "none"; // Hide if no analysis data
            }

        } catch (error) {
            errorMessageDiv.textContent = `Falha ao obter previsão: ${error.message}`;
            errorMessageDiv.style.display = "block";
            predictionOutputDiv.innerHTML = "<p>Ocorreu um erro.</p>"; // Clear prediction on error
            smartPickInfoDiv.style.display = "none"; // Hide analysis on error
        } finally {
            loadingIndicator.style.display = "none";
        }
    });
});

