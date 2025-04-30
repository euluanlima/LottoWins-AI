document.addEventListener("DOMContentLoaded", () => {
    // --- Views ---
    const lotterySelectionView = document.getElementById("lottery-selection");
    const gameDetailsView = document.getElementById("game-details-view");
    const backButton = document.getElementById("back-to-selection");
    const selectedGameTitle = document.getElementById("selected-game-title");

    // --- Current Game State ---
    let currentGame = null;

    // --- Prediction Elements ---
    // const gameSelect = document.getElementById("game-select"); // Might be removed/hidden
    const predictButton = document.getElementById("predict-button");
    const predictionOutputDiv = document.getElementById("prediction-output");
    const smartPickInfoDiv = document.getElementById("smart-pick-info");
    const loadingIndicator = document.getElementById("loading");
    const errorMessageDiv = document.getElementById("error-message");
    const hotNumbersSpan = document.getElementById("hot-numbers");
    const coldNumbersSpan = document.getElementById("cold-numbers");
    const hotSpecialSpan = document.getElementById("hot-special");
    const coldSpecialSpan = document.getElementById("cold-special");

    // --- Ticket Checker Elements ---
    // const checkGameSelect = document.getElementById("check-game-select"); // Might be removed/hidden
    const ticketNumbersInput = document.getElementById("ticket-numbers");
    const specialNumberInput = document.getElementById("special-number");
    const drawDateInput = document.getElementById("draw-date");
    const checkTicketButton = document.getElementById("check-ticket-button");
    const checkerResultDiv = document.getElementById("checker-result");

    // --- Reminder Elements ---
    const reminderToggles = {
        "Powerball": document.getElementById("powerball-reminder"),
        "Mega Millions": document.getElementById("megamillions-reminder"),
        "Cash4Life": document.getElementById("cash4life-reminder")
    };
    const reminderSections = document.querySelectorAll(".notification-toggle[data-game-toggle]");

    // --- View Switching Logic ---
    const showDetailsView = (gameName) => {
        currentGame = gameName;
        selectedGameTitle.textContent = `${gameName} - Ferramentas e Previsões`;
        lotterySelectionView.style.display = "none";
        gameDetailsView.style.display = "block";

        // Reset prediction/checker outputs
        predictionOutputDiv.innerHTML = `<p>Clique em "Gerar Novo Smart Pick".</p>`;
        smartPickInfoDiv.style.display = "none";
        checkerResultDiv.style.display = "none";
        errorMessageDiv.style.display = "none";

        // Show only the relevant reminder toggle
        reminderSections.forEach(section => {
            if (section.getAttribute("data-game-toggle") === gameName) {
                section.style.display = "flex"; // Or "block"
            } else {
                section.style.display = "none";
            }
        });

        // Optional: Trigger initial prediction
        // predictButton.click();
    };

    const showSelectionView = () => {
        currentGame = null;
        lotterySelectionView.style.display = "block";
        gameDetailsView.style.display = "none";
    };

    // Add event listeners to lottery cards
    document.querySelectorAll(".lottery-card").forEach(card => {
        card.addEventListener("click", () => {
            const gameName = card.getAttribute("data-game");
            if (gameName) {
                showDetailsView(gameName);
            }
        });
    });

    // Add event listener to back button
    backButton.addEventListener("click", showSelectionView);

    // --- Reminder Logic ---
    const loadReminderPreferences = () => {
        for (const game in reminderToggles) {
            if (reminderToggles[game]) {
                const savedPref = localStorage.getItem(`${game.toLowerCase().replace(" ", "")}-reminder`);
                reminderToggles[game].checked = (savedPref === "enabled");
            }
        }
    };

    const saveReminderPreference = (gameName, isEnabled) => {
        localStorage.setItem(`${gameName.toLowerCase().replace(" ", "")}-reminder`, isEnabled ? "enabled" : "disabled");
        console.log(`Reminder for ${gameName} set to: ${isEnabled ? "enabled" : "disabled"}`);
    };

    // Add event listeners to reminder toggles
    for (const game in reminderToggles) {
        if (reminderToggles[game]) {
            reminderToggles[game].addEventListener("change", (event) => {
                saveReminderPreference(game, event.target.checked);
            });
        }
    }

    // Load preferences when the page loads
    loadReminderPreferences();

    // --- Prediction Logic (Adapted) ---
    predictButton.addEventListener("click", async () => {
        if (!currentGame) {
            errorMessageDiv.textContent = "Erro: Nenhum jogo selecionado.";
            errorMessageDiv.style.display = "block";
            return;
        }

        errorMessageDiv.style.display = "none";
        predictionOutputDiv.innerHTML = "";
        smartPickInfoDiv.style.display = "none";
        loadingIndicator.style.display = "block";

        try {
            const response = await fetch(`/predict/${encodeURIComponent(currentGame)}`);
            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || `Erro: ${response.status} ${response.statusText}`);
            }

            let predictionHTML = `<h4>Sua Previsão Smart Pick</h4>`;
            if (data.prediction && data.prediction.predicted_main && data.prediction.predicted_main.length > 0) {
                predictionHTML += `<p><strong>Números Principais:</strong> <span class="numbers">${data.prediction.predicted_main.join(", ")}</span></p>`;
                const specialBallKey = Object.keys(data.prediction).find(key => key.startsWith("predicted_") && key !== "predicted_main");
                if (specialBallKey && data.prediction[specialBallKey] !== null) {
                    const specialBallName = specialBallKey.replace("predicted_", "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                    predictionHTML += `<p><strong>${specialBallName}:</strong> <span class="numbers">${data.prediction[specialBallKey]}</span></p>`;
                } else {
                     predictionHTML += `<p><strong>Bola Especial:</strong> (Não aplicável/disponível)</p>`;
                }
            } else {
                predictionHTML += `<p>Não foi possível gerar a previsão principal.</p>`;
            }
            predictionOutputDiv.innerHTML = predictionHTML;

            if (data.analysis) {
                hotNumbersSpan.textContent = data.analysis.hot_main?.join(", ") || "--";
                coldNumbersSpan.textContent = data.analysis.cold_main?.join(", ") || "--";
                hotSpecialSpan.textContent = data.analysis.hot_special?.join(", ") || "--";
                coldSpecialSpan.textContent = data.analysis.cold_special?.join(", ") || "--";
                smartPickInfoDiv.style.display = "block";
            } else {
                 smartPickInfoDiv.style.display = "none";
            }

        } catch (error) {
            errorMessageDiv.textContent = `Falha ao obter previsão: ${error.message}`;
            errorMessageDiv.style.display = "block";
            predictionOutputDiv.innerHTML = "<p>Ocorreu um erro ao gerar a previsão.</p>";
            smartPickInfoDiv.style.display = "none";
        } finally {
            loadingIndicator.style.display = "none";
        }
    });

    // --- Ticket Checker Logic (Adapted) ---
    checkTicketButton.addEventListener("click", async () => {
        if (!currentGame) {
            checkerResultDiv.textContent = "Erro: Nenhum jogo selecionado.";
            checkerResultDiv.style.color = "var(--error-color)";
            checkerResultDiv.style.display = "block";
            return;
        }

        const numbers = ticketNumbersInput.value.trim();
        const special = specialNumberInput.value.trim();
        const date = drawDateInput.value;

        // Basic validation
        if (!numbers || !date) {
            checkerResultDiv.textContent = "Por favor, preencha os números principais e a data do sorteio.";
            checkerResultDiv.style.color = "var(--error-color)";
            checkerResultDiv.style.display = "block";
            return;
        }

        // Clear previous result and show loading
        checkerResultDiv.textContent = "Verificando...";
        checkerResultDiv.style.color = "var(--text-secondary)";
        checkerResultDiv.style.display = "block";

        try {
            const response = await fetch("/check_ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Send the currently selected game
                body: JSON.stringify({ game: currentGame, numbers, special, date }),
            });

            const resultData = await response.json();

            if (!response.ok) {
                throw new Error(resultData.error || resultData.description || `Erro: ${response.status}`);
            }

            // Display success message
            checkerResultDiv.textContent = resultData.message;
            if (resultData.winning_numbers) {
                 checkerResultDiv.innerHTML += `<br><small>Números Sorteados: ${resultData.winning_numbers} | Especial: ${resultData.winning_special || '--'}</small>`;
            }
            // Determine color based on result (simple check for now)
            if (resultData.main_matches > 0 || resultData.special_match) {
                 checkerResultDiv.style.color = "var(--success-color)";
            } else {
                 checkerResultDiv.style.color = "var(--text-primary)"; // Neutral color for no match
            }

        } catch (error) {
            // Display error message
            checkerResultDiv.textContent = `Erro ao verificar: ${error.message}`;
            checkerResultDiv.style.color = "var(--error-color)";
        } finally {
            checkerResultDiv.style.display = "block"; // Ensure result is visible
        }
    });

});

