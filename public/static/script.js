document.addEventListener("DOMContentLoaded", () => {
    // --- Views ---
    const lotterySelectionView = document.getElementById("lottery-selection");
    const dashboardView = document.getElementById("dashboard-view"); // Updated ID
    const backButton = document.getElementById("back-to-selection");
    const dashboardTitle = document.getElementById("dashboard-title"); // Updated ID
    const dashboardGameLogo = document.getElementById("dashboard-game-logo"); // New element

    // --- Current Game State ---
    let currentGame = null;

    // --- Prediction Elements ---
    const predictButton = document.getElementById("predict-button");
    const predictionTablePlaceholder = document.getElementById("prediction-table-placeholder"); // Updated ID
    const smartPickAnalysisDiv = document.getElementById("smart-pick-analysis"); // Updated ID
    const loadingIndicator = document.getElementById("loading");
    const errorMessageDiv = document.getElementById("error-message");
    const hotNumbersSpan = document.getElementById("hot-numbers");
    const coldNumbersSpan = document.getElementById("cold-numbers");
    const hotSpecialSpan = document.getElementById("hot-special");
    const coldSpecialSpan = document.getElementById("cold-special");

    // --- Ticket Checker Elements ---
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
    // We might not need to hide/show individual toggles if they are all in the dashboard
    // const reminderSections = document.querySelectorAll(".notification-toggle[data-game-toggle]");

    // --- Logo Paths (Placeholders) ---
    const logoPaths = {
        "Powerball": "/static/images/powerball-logo-placeholder.png",
        "Mega Millions": "/static/images/megamillions-logo-placeholder.png",
        "Cash4Life": "/static/images/cash4life-logo-placeholder.png"
    };

    // --- View Switching Logic (Updated) ---
    const showDashboardView = (gameName) => {
        currentGame = gameName;
        dashboardTitle.textContent = `Dashboard - ${gameName}`;
        dashboardGameLogo.src = logoPaths[gameName] || ""; // Set dashboard logo
        dashboardGameLogo.alt = `${gameName} Logo`;

        lotterySelectionView.classList.remove("active-view");
        dashboardView.classList.add("active-view");

        // Reset prediction/checker outputs
        predictionTablePlaceholder.innerHTML = "Clique em \"Gerar Novo Smart Pick\".";
        smartPickAnalysisDiv.style.display = "none"; // Hide analysis until prediction is fetched
        checkerResultDiv.style.display = "none";
        errorMessageDiv.style.display = "none";

        // Optional: Trigger initial prediction
        // predictButton.click();
    };

    const showSelectionView = () => {
        currentGame = null;
        dashboardView.classList.remove("active-view");
        lotterySelectionView.classList.add("active-view");
    };

    // Add event listeners to lottery card buttons (Updated selector)
    document.querySelectorAll(".lottery-card .select-button").forEach(button => {
        const card = button.closest(".lottery-card");
        button.addEventListener("click", () => {
            const gameName = card.getAttribute("data-game");
            if (gameName) {
                showDashboardView(gameName);
            }
        });
    });

    // Add event listener to back button
    backButton.addEventListener("click", showSelectionView);

    // --- Reminder Logic (No changes needed for basic functionality) ---
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
        // console.log(`Reminder for ${gameName} set to: ${isEnabled ? "enabled" : "disabled"}`);
    };

    for (const game in reminderToggles) {
        if (reminderToggles[game]) {
            reminderToggles[game].addEventListener("change", (event) => {
                saveReminderPreference(game, event.target.checked);
            });
        }
    }
    loadReminderPreferences();

    // --- Prediction Logic (Adapted for new structure) ---
    predictButton.addEventListener("click", async () => {
        if (!currentGame) {
            errorMessageDiv.textContent = "Erro: Nenhum jogo selecionado.";
            errorMessageDiv.style.display = "block";
            return;
        }

        errorMessageDiv.style.display = "none";
        predictionTablePlaceholder.innerHTML = ""; // Clear placeholder
        smartPickAnalysisDiv.style.display = "none";
        loadingIndicator.style.display = "block";

        try {
            const response = await fetch(`/predict/${encodeURIComponent(currentGame)}`);
            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || `Erro: ${response.status} ${response.statusText}`);
            }

            let predictionHTML = ``; // Build table or list
            if (data.prediction && data.prediction.predicted_main && data.prediction.predicted_main.length > 0) {
                // Example: Simple list for now, could be a table like reference
                predictionHTML += `<ul>`;
                // Assuming prediction format might be a list of lists or similar
                // This part needs refinement based on actual API response structure for multiple picks
                // For now, displaying the first prediction if available
                const mainNumbers = data.prediction.predicted_main.join(", ");
                const specialBallKey = Object.keys(data.prediction).find(key => key.startsWith("predicted_") && key !== "predicted_main");
                const specialBallValue = specialBallKey ? data.prediction[specialBallKey] : null;
                predictionHTML += `<li><span class="numbers">${mainNumbers}</span>`
                if (specialBallValue !== null) {
                     predictionHTML += ` <span class="numbers special-ball">${specialBallValue}</span>`;
                }
                predictionHTML += `</li>`;
                // Add more list items if multiple predictions are returned
                predictionHTML += `</ul>`;

            } else {
                predictionHTML = `<p>Não foi possível gerar a previsão.</p>`;
            }
            predictionTablePlaceholder.innerHTML = predictionHTML;

            if (data.analysis) {
                hotNumbersSpan.textContent = data.analysis.hot_main?.join(", ") || "--";
                coldNumbersSpan.textContent = data.analysis.cold_main?.join(", ") || "--";
                hotSpecialSpan.textContent = data.analysis.hot_special?.join(", ") || "--";
                coldSpecialSpan.textContent = data.analysis.cold_special?.join(", ") || "--";
                smartPickAnalysisDiv.style.display = "block";
            } else {
                 smartPickAnalysisDiv.style.display = "none";
            }

        } catch (error) {
            errorMessageDiv.textContent = `Falha ao obter previsão: ${error.message}`;
            errorMessageDiv.style.display = "block";
            predictionTablePlaceholder.innerHTML = "<p>Ocorreu um erro.</p>";
            smartPickAnalysisDiv.style.display = "none";
        } finally {
            loadingIndicator.style.display = "none";
        }
    });

    // --- Ticket Checker Logic (Adapted for new structure) ---
    checkTicketButton.addEventListener("click", async () => {
        if (!currentGame) {
            checkerResultDiv.textContent = "Erro: Nenhum jogo selecionado.";
            checkerResultDiv.style.color = "red"; // Use CSS variables later
            checkerResultDiv.style.display = "block";
            return;
        }

        const numbers = ticketNumbersInput.value.trim();
        const special = specialNumberInput.value.trim();
        const date = drawDateInput.value;

        if (!numbers || !date) {
            checkerResultDiv.textContent = "Preencha os números principais e a data.";
            checkerResultDiv.style.color = "orange"; // Use CSS variables later
            checkerResultDiv.style.display = "block";
            return;
        }

        checkerResultDiv.textContent = "Verificando...";
        checkerResultDiv.style.color = "var(--text-secondary)";
        checkerResultDiv.style.display = "block";

        try {
            const response = await fetch("/check_ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ game: currentGame, numbers, special, date }),
            });

            const resultData = await response.json();

            if (!response.ok) {
                throw new Error(resultData.error || `Erro: ${response.status}`);
            }

            checkerResultDiv.innerHTML = resultData.message; // Use innerHTML to allow potential formatting
            if (resultData.winning_numbers) {
                 checkerResultDiv.innerHTML += `<br><small>Sorteado: ${resultData.winning_numbers} | Especial: ${resultData.winning_special || '--'}</small>`;
            }
            // Basic styling based on result
            if (resultData.main_matches > 0 || resultData.special_match) {
                 checkerResultDiv.style.color = "green"; // Use CSS variables later
            } else if (resultData.message.includes("Nenhum sorteio")) {
                 checkerResultDiv.style.color = "orange";
            } else {
                 checkerResultDiv.style.color = "var(--text-primary)";
            }

        } catch (error) {
            checkerResultDiv.textContent = `Erro: ${error.message}`;
            checkerResultDiv.style.color = "red";
        } finally {
            checkerResultDiv.style.display = "block";
        }
    });

});

