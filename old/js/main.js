class GameApp {
    constructor() {
        this.state = new GameState();
        this.ui = new UIManager();

        this.init();
    }

    init() {
        // Initialize UI with saved settings
        this.updateLanguage(this.state.settings.language);
        this.ui.updateSetupUI(this.state);
        this.ui.renderWordLists(this.state.selectedLists, (id) => this.toggleWordList(id));

        // Bind Events
        this.bindEvents();

        // Expose API
        window.UndercoverApp = {
            startGame: () => this.startGame(),
            resetGame: () => this.goToHome(),
            setLanguage: (lang) => this.updateLanguage(lang),
            updateSettings: (settings) => this.updateSettings(settings),
            setWordList: (id, enabled) => {
                this.state.selectedLists[id] = enabled;
                this.state.saveSelectedLists();
                this.ui.renderWordLists(this.state.selectedLists, (id) => this.toggleWordList(id));
            }
        };
    }

    bindEvents() {
        // Home Screen
        document.getElementById('btn-new-game').onclick = () => this.goToModeSelection();
        document.getElementById('btn-rules').onclick = () => this.ui.toggleSettingsModal(true, 'home-rules');
        document.getElementById('btn-settings').onclick = () => this.ui.toggleSettingsModal(true, 'home-settings');
        document.getElementById('btn-word-lists').onclick = () => this.goToWordListsDisplay();

        // Navigation
        document.getElementById('btn-back-mode').onclick = () => this.goToHome();
        document.getElementById('btn-back-duo').onclick = () => this.goToModeSelection();
        document.getElementById('btn-back-setup').onclick = () => {
            if (this.state.currentMode === 'duo') this.goToDuoSelection();
            else this.goToModeSelection();
        };
        document.getElementById('btn-back-lists').onclick = () => this.goToHome();

        // Game Navigation
        document.getElementById('btn-home-game').onclick = () => this.returnToHome();
        document.getElementById('btn-home-vote').onclick = () => this.returnToHome();
        document.getElementById('btn-home-elimination').onclick = () => this.returnToHome();
        document.getElementById('btn-home-gameover').onclick = () => this.goToHome();

        // Mode Selection
        document.querySelectorAll('.mode-card').forEach(card => {
            card.onclick = () => {
                const mode = card.dataset.mode;
                if (mode === 'duo') this.goToDuoSelection();
                else this.goToSetup(mode);
            };
        });

        // Duo Selection
        document.querySelectorAll('.duo-card').forEach(card => {
            card.onclick = () => {
                const submode = card.dataset.submode;
                this.goToSetup('duo', submode);
            };
        });

        // Setup Controls
        document.getElementById('btn-decrease-players').onclick = () => {
            this.state.updatePlayerCount(-1);
            this.ui.updateSetupUI(this.state);
        };
        document.getElementById('btn-increase-players').onclick = () => {
            this.state.updatePlayerCount(1);
            this.ui.updateSetupUI(this.state);
        };
        document.getElementById('btn-decrease-undercover').onclick = () => {
            this.state.updateUndercoverCount(-1);
            this.ui.updateSetupUI(this.state);
        };
        document.getElementById('btn-increase-undercover').onclick = () => {
            this.state.updateUndercoverCount(1);
            this.ui.updateSetupUI(this.state);
        };
        document.getElementById('toggle-mrwhite').onchange = (e) => {
            this.state.mrWhiteEnabled = e.target.checked;
            this.state.updateUndercoverCount(0); // Re-validate count
            this.ui.updateSetupUI(this.state);
        };
        document.getElementById('btn-start-game').onclick = () => this.startGame();

        // Reveal Screen
        document.getElementById('secret-card').onclick = () => {
            if (!document.getElementById('secret-card').classList.contains('flipped')) {
                const player = this.state.players[this.state.currentPlayerIndex];
                this.ui.showSecret(player, this.state.currentWordPair);
            }
        };
        document.getElementById('btn-confirm-secret').onclick = () => this.nextPlayerReveal();

        // Game Screen
        document.getElementById('btn-start-vote').onclick = () => this.startVote();

        // Elimination Screen
        document.getElementById('btn-mr-white-guess').onclick = () => this.handleMrWhiteGuess();
        document.getElementById('btn-next-round').onclick = () => this.nextRound();

        // Game Over
        document.getElementById('btn-restart').onclick = () => this.startGame();

        // Settings Modal
        document.getElementById('btn-close-settings').onclick = () => this.ui.toggleSettingsModal(false);
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = () => this.ui.switchTab(btn.dataset.tab);
        });
        document.getElementById('btn-save-settings').onclick = () => {
            this.ui.toggleSettingsModal(false);
            // Reload to apply language changes if any
            if (this.state.settings.language !== document.getElementById('setting-language').value) {
                this.updateSettingsFromUI();
                location.reload();
            } else {
                this.updateSettingsFromUI();
            }
        };
        document.getElementById('btn-credits').onclick = () => {
            alert('Undercover Game\n\nDéveloppé par OLLIER FABIO\n\n© 2025');
        };
    }

    // Bind events for a specific mode (classic or duo)
    bindModeEvents(mode) {
        const suffix = mode;

        // Back button
        const btnBackSetup = document.getElementById(`btn-back-setup-${suffix}`);
        if (btnBackSetup) {
            btnBackSetup.onclick = () => {
                if (this.state.currentMode === 'duo') this.goToDuoSelection();
                else this.goToModeSelection();
            };
        }

        // Setup Controls
        const btnDecPlayers = document.getElementById(`btn-decrease-players-${suffix}`);
        const btnIncPlayers = document.getElementById(`btn-increase-players-${suffix}`);
        const btnDecUndercover = document.getElementById(`btn-decrease-undercover-${suffix}`);
        const btnIncUndercover = document.getElementById(`btn-increase-undercover-${suffix}`);
        const toggleMrWhite = document.getElementById(`toggle-mrwhite-${suffix}`);
        const btnStartGame = document.getElementById(`btn-start-game-${suffix}`);

        if (btnDecPlayers) btnDecPlayers.onclick = () => {
            this.state.updatePlayerCount(-1);
            this.ui.updateSetupUI(this.state);
        };
        if (btnIncPlayers) btnIncPlayers.onclick = () => {
            this.state.updatePlayerCount(1);
            this.ui.updateSetupUI(this.state);
        };
        if (btnDecUndercover) btnDecUndercover.onclick = () => {
            this.state.updateUndercoverCount(-1);
            this.ui.updateSetupUI(this.state);
        };
        if (btnIncUndercover) btnIncUndercover.onclick = () => {
            this.state.updateUndercoverCount(1);
            this.ui.updateSetupUI(this.state);
        };
        if (toggleMrWhite) toggleMrWhite.onchange = (e) => {
            this.state.mrWhiteEnabled = e.target.checked;
            this.state.updateUndercoverCount(0);
            this.ui.updateSetupUI(this.state);
        };
        if (btnStartGame) btnStartGame.onclick = () => this.startGame();

        // Reveal Screen
        const secretCard = document.getElementById(`secret-card-${suffix}`);
        const btnConfirmSecret = document.getElementById(`btn-confirm-secret-${suffix}`);

        if (secretCard) secretCard.onclick = () => {
            if (!secretCard.classList.contains('flipped')) {
                const player = this.state.players[this.state.currentPlayerIndex];
                this.ui.showSecret(player, this.state.currentWordPair);
            }
        };
        if (btnConfirmSecret) btnConfirmSecret.onclick = () => this.nextPlayerReveal();

        // Game Screen
        const btnStartVote = document.getElementById(`btn-start-vote-${suffix}`);
        const btnHomeGame = document.getElementById(`btn-home-game-${suffix}`);

        if (btnStartVote) btnStartVote.onclick = () => this.startVote();
        if (btnHomeGame) btnHomeGame.onclick = () => this.returnToHome();

        // Vote Screen
        const btnHomeVote = document.getElementById(`btn-home-vote-${suffix}`);
        if (btnHomeVote) btnHomeVote.onclick = () => this.returnToHome();

        // Elimination Screen
        const btnMrWhiteGuess = document.getElementById(`btn-mr-white-guess-${suffix}`);
        const btnNextRound = document.getElementById(`btn-next-round-${suffix}`);
        const btnHomeElimination = document.getElementById(`btn-home-elimination-${suffix}`);

        if (btnMrWhiteGuess) btnMrWhiteGuess.onclick = () => this.handleMrWhiteGuess();
        if (btnNextRound) btnNextRound.onclick = () => this.nextRound();
        if (btnHomeElimination) btnHomeElimination.onclick = () => this.returnToHome();

        // Game Over
        const btnRestart = document.getElementById(`btn-restart-${suffix}`);
        const btnHomeGameover = document.getElementById(`btn-home-gameover-${suffix}`);

        if (btnRestart) btnRestart.onclick = () => this.startGame();
        if (btnHomeGameover) btnHomeGameover.onclick = () => this.goToHome();
    }


    updateSettingsFromUI() {
        this.state.settings.language = document.getElementById('setting-language').value;
        this.state.settings.wordsLanguage = document.getElementById('setting-words-language').value;
        this.state.settings.mrWhitePlayer1 = document.getElementById('setting-mrwhite-player1').checked;
        this.state.settings.revealRoles = document.getElementById('setting-reveal-roles').checked;
        this.state.settings.soundEnabled = document.getElementById('setting-sound').checked;
        this.state.settings.vibrationEnabled = document.getElementById('setting-vibration').checked;

        const timer = document.querySelector('input[name="vote-timer"]:checked');
        if (timer) this.state.settings.voteTimer = timer.value;

        const mode = document.querySelector('input[name="game-mode"]:checked');
        if (mode) this.state.settings.gameMode = mode.value;

        const firstPlayer = document.querySelector('input[name="first-player"]:checked');
        if (firstPlayer) this.state.settings.firstPlayer = firstPlayer.value;

        this.state.saveSettings();
        this.updateLanguage(this.state.settings.language);
    }

    updateLanguage(lang) {
        if (typeof translations === 'undefined' || !translations[lang]) return;

        currentLanguage = lang;
        document.documentElement.lang = lang;

        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.');
            let value = translations[lang];
            keys.forEach(k => {
                if (value) value = value[k];
            });

            if (value) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = value;
                } else {
                    element.innerText = value;
                }
            }
        });

        // Update settings dropdowns
        document.getElementById('setting-language').value = this.state.settings.language;
        document.getElementById('setting-words-language').value = this.state.settings.wordsLanguage;
    }

    goToHome() {
        this.state.state = 'HOME';
        this.ui.showScreen('home');
    }

    goToModeSelection() {
        this.ui.showScreen('modeSelection');
    }

    goToDuoSelection() {
        this.ui.showScreen('duoSelection');
    }

    goToWordListsDisplay() {
        this.ui.showScreen('wordListsDisplay');
        this.ui.renderWordLists(this.state.selectedLists, (id) => this.toggleWordList(id));
    }

    goToSetup(mode, subMode = null) {
        this.state.currentMode = mode;
        this.state.currentSubMode = subMode;

        // Set current mode in UI for dynamic routing
        this.ui.setCurrentMode(mode);

        // Auto-select lists logic
        this.autoSelectLists(mode);

        this.ui.showScreen('setup');
        this.state.updatePlayerCount(0); // Reset/Validate count
        this.ui.updateSetupUI(this.state);
    }

    autoSelectLists(mode) {
        if (mode === 'children') {
            const childrenLists = ['enfants_animaux', 'enfants_objets', 'enfants_aliments'];
            if (!childrenLists.some(id => this.state.selectedLists[id])) {
                childrenLists.forEach(id => this.state.selectedLists[id] = true);
                this.state.saveSelectedLists();
            }
        } else if (mode === 'hardcore') {
            const hardcoreLists = ['hardcore_animaux', 'hardcore_objets'];
            if (!hardcoreLists.some(id => this.state.selectedLists[id])) {
                hardcoreLists.forEach(id => this.state.selectedLists[id] = true);
                this.state.saveSelectedLists();
            }
        } else if (mode === 'classic' || mode === 'duo') {
            const classicLists = ['classique', 'films', 'cuisine', 'sports', 'culture', 'jeux'];
            if (!classicLists.some(id => this.state.selectedLists[id])) {
                this.state.selectedLists['classique'] = true;
                this.state.saveSelectedLists();
            }
        }
    }

    toggleWordList(listId) {
        this.state.selectedLists[listId] = !this.state.selectedLists[listId];

        // Ensure at least one list is selected
        if (!Object.values(this.state.selectedLists).some(v => v)) {
            this.state.selectedLists[listId] = true;
        }

        this.state.saveSelectedLists();
        this.ui.renderWordLists(this.state.selectedLists, (id) => this.toggleWordList(id));
    }

    startGame() {
        const inputs = document.querySelectorAll('#player-inputs-container input');
        const names = Array.from(inputs).map(input => input.value.trim() || input.placeholder);

        const availableWords = this.state.getAvailableWords();
        if (availableWords.length === 0) {
            alert("Aucune liste de mots valide sélectionnée !");
            return;
        }

        // Select Word Pair
        this.selectWordPair(availableWords);

        // Reset and Add Players
        this.state.players = []; // Clear existing
        names.forEach(name => this.state.addPlayer(name));

        // Assign Roles
        this.state.assignRoles();

        // Start Reveal
        this.state.firstPlayerIndex = this.state.determineFirstPlayer();
        this.state.currentPlayerIndex = 0;
        this.ui.showScreen('reveal');
        this.ui.renderRevealScreen(this.state.players[0], true);
    }

    selectWordPair(availableWords) {
        if (this.state.currentMode === 'duo') {
            if (this.state.currentSubMode === 'duo-chaos') {
                // Chaos: 2 different pairs
                const idx1 = Math.floor(Math.random() * availableWords.length);
                let idx2 = Math.floor(Math.random() * availableWords.length);
                while (idx1 === idx2 && availableWords.length > 1) {
                    idx2 = Math.floor(Math.random() * availableWords.length);
                }
                const pair1 = availableWords[idx1];
                const pair2 = availableWords[idx2];
                this.state.currentWordPair = {
                    player1: Math.random() < 0.5 ? pair1.word1 : pair1.word2,
                    player2: Math.random() < 0.5 ? pair2.word1 : pair2.word2,
                    mode: 'duo-chaos'
                };
            } else {
                // Classic Duo
                const pair = availableWords[Math.floor(Math.random() * availableWords.length)];
                const swap = Math.random() < 0.5;
                this.state.currentWordPair = {
                    player1: swap ? pair.word2 : pair.word1,
                    player2: swap ? pair.word1 : pair.word2,
                    mode: 'duo-classic'
                };
            }
        } else if (this.state.currentMode === 'hardcore') {
            const triplets = availableWords.filter(w => w.word3);
            if (triplets.length > 0) {
                const triplet = triplets[Math.floor(Math.random() * triplets.length)];
                this.state.currentWordPair = {
                    citizen: triplet.word1,
                    undercover: triplet.word2,
                    undercover2: triplet.word3
                };
            } else {
                // Fallback
                const pair = availableWords[Math.floor(Math.random() * availableWords.length)];
                this.state.currentWordPair = {
                    citizen: pair.word1,
                    undercover: pair.word2,
                    undercover2: pair.word2
                };
            }
        } else {
            // Classic / Children
            const pair = availableWords[Math.floor(Math.random() * availableWords.length)];
            const swap = Math.random() < 0.5;
            this.state.currentWordPair = {
                citizen: swap ? pair.word2 : pair.word1,
                undercover: swap ? pair.word1 : pair.word2
            };
        }
    }



    nextPlayerReveal() {
        this.state.currentPlayerIndex++;
        if (this.state.currentPlayerIndex >= this.state.playerCount) {
            // All revealed
            this.state.state = 'GAME';
            this.ui.showScreen('game');
            this.ui.updateGameScreen(this.state);
        } else {
            // Next player
            const player = this.state.players[this.state.currentPlayerIndex];
            this.ui.renderRevealScreen(player, false);
        }
    }

    startVote() {
        this.state.state = 'VOTE';
        this.ui.showScreen('vote');
        this.ui.renderVoteScreen(this.state.players, (player) => this.handleVote(player));

        // Timer logic here if needed
    }

    handleVote(player) {
        if (!confirm(`${translations[currentLanguage].vote.confirmElimination} ${player.name} ?`)) return;

        player.isAlive = false;

        // Check win conditions
        const result = this.checkWinCondition();
        if (result) {
            this.ui.showGameOver(result, null, this.state.players, this.state.currentWordPair);
            this.ui.showScreen('gameover');
            return;
        }

        // Show elimination screen
        const isMrWhite = player.role === 'MR_WHITE';
        this.ui.showElimination(player, player.role, isMrWhite);
        this.ui.showScreen('elimination');
    }

    startVote() {
        this.state.state = 'VOTE';
        this.ui.showScreen('vote');
        this.ui.renderVoteScreen(this.state.players, (player) => this.handleVote(player));
    }

    handleVote(player) {
        player.isAlive = false;
        this.ui.showScreen('elimination');

        const isMrWhite = player.role === 'MR_WHITE';
        this.ui.showElimination(player, player.role, isMrWhite);

        if (isMrWhite) return;

        const winState = this.checkWinCondition();
        if (winState) {
            this.ui.showGameOver(winState, null, this.state.players, this.state.currentWordPair);
            this.ui.showScreen('gameover');
        }
    }

    handleMrWhiteGuess() {
        const guess = document.getElementById('mr-white-input').value.trim();
        if (!guess) return;

        const citizenWord = this.state.currentWordPair.citizen.toLowerCase();
        if (guess.toLowerCase() === citizenWord) {
            this.ui.showGameOver('MR_WHITE_GUESS', null, this.state.players, this.state.currentWordPair);
            this.ui.showScreen('gameover');
        } else {
            alert(translations[currentLanguage].elimination.wrongGuess || "Mauvaise réponse !");

            const winState = this.checkWinCondition();
            if (winState) {
                this.ui.showGameOver(winState, null, this.state.players, this.state.currentWordPair);
                this.ui.showScreen('gameover');
            } else {
                this.nextRound();
            }
        }
    }

    nextRound() {
        this.state.state = 'GAME';
        this.ui.showScreen('game');
        this.ui.updateGameScreen(this.state);
    }

    checkWinCondition() {
        const alive = this.state.players.filter(p => p.isAlive);
        const citizens = alive.filter(p => p.role === 'CITIZEN').length;
        const impostors = alive.filter(p => p.role === 'UNDERCOVER' || p.role === 'MR_WHITE').length;
        const mrWhite = alive.filter(p => p.role === 'MR_WHITE').length;

        if (impostors === 0) return 'CITIZENS_WIN';
        if (impostors >= citizens) return 'IMPOSTORS_WIN';

        return null; // Continue game
    }

    returnToHome() {
        if (confirm(translations[currentLanguage].game.confirmExit)) {
            this.goToHome();
        }
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    new GameApp();
});
