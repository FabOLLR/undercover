import { GameState } from './state.js';

export class UI {
    constructor() {
        this.state = new GameState();
        this.currentView = null;

        // Listen for view changes
        document.addEventListener('view-loaded', (e) => {
            this.initView(e.detail.view);
        });

        // Global event delegation
        document.addEventListener('click', (e) => this.handleGlobalClick(e));
        document.addEventListener('input', (e) => this.handleInput(e));
        document.addEventListener('change', (e) => this.handleChange(e));
    }

    handleGlobalClick(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        const value = target.dataset.target || target.dataset.value;

        switch (action) {
            case 'navigate':
                window.router.load(value);
                break;
            case 'open-modal':
                this.openModal(value);
                break;
            case 'close-modal':
                this.closeModal(value);
                break;
            case 'save-settings':
                this.saveSettings();
                break;
            case 'save-mode-settings':
                this.saveModeSettings();
                break;
            case 'save-mode-lists':
                this.saveModeLists();
                break;
            case 'adjust-players':
                this.adjustPlayers(parseInt(target.dataset.amount));
                break;
            case 'adjust-undercover':
                this.adjustUndercover(parseInt(target.dataset.amount));
                break;
            case 'start-game':
                this.startGame();
                break;
            case 'select-duo-submode':
                // Handle duo submode selection
                document.querySelectorAll('[data-action="select-duo-submode"]').forEach(btn => {
                    btn.classList.remove('active');
                });
                target.classList.add('active');
                const submode = target.dataset.submode;
                this.state.setCurrentSubMode(submode);
                // Update description
                const desc = document.getElementById('duo-description');
                if (desc) {
                    desc.textContent = submode === 'classic' ?
                        'Devinez si vous avez le même mot ou des mots différents.' :
                        'Devinez le mot de l\'adversaire avant qu\'il ne devine le vôtre !';
                }
                break;
            case 'reveal-card':
                this.revealCard();
                break;
            case 'confirm-secret':
                this.confirmSecret();
                break;
            case 'start-vote':
                window.router.load('vote');
                break;
            case 'vote-player':
                this.votePlayer(parseInt(target.dataset.id));
                break;
            case 'show-results':
                this.showVoteResults();
                break;
            case 'next-round':
                this.nextRound();
                break;
            case 'mr-white-guess':
                this.handleMrWhiteGuess();
                break;
        }
    }

    handleInput(e) {
        if (e.target.dataset.playerIndex !== undefined) {
            const index = parseInt(e.target.dataset.playerIndex);
            const name = e.target.value.trim();
            if (this.state.players[index]) {
                this.state.players[index].name = name || `Joueur ${index + 1}`;
            }
        }
    }

    handleChange(e) {
        if (e.target.id === 'toggle-mrwhite') {
            this.state.setMrWhiteEnabled(e.target.checked);
            this.updateConfigUI();
        }
    }

    initView(viewName) {
        this.currentView = viewName;
        console.log(`View loaded: ${viewName}`);

        if (viewName.startsWith('mode-')) {
            const mode = viewName.replace('mode-', '');
            this.state.setCurrentMode(mode === 'children' ? 'children' : mode);
            this.renderConfigScreen();
        } else if (viewName === 'reveal') {
            this.renderRevealScreen();
        } else if (viewName === 'game') {
            this.renderGameScreen();
        } else if (viewName === 'vote') {
            this.renderVoteScreen();
        } else if (viewName === 'elimination') {
            this.renderEliminationScreen();
        } else if (viewName === 'gameover') {
            this.renderGameOverScreen();
        }

        // Trigger translation if available
        if (window.updateUI) window.updateUI();
    }

    // Configuration Screen Logic
    renderConfigScreen() {
        // Initialize default counts
        if (this.state.currentMode === 'duo') {
            this.state.playerCount = 2;
        } else if (!this.state.playerCount || this.state.playerCount < 3) {
            this.state.playerCount = 6;
        }

        this.state.updatePlayerCount(0); // Validate
        this.updateConfigUI();
    }

    updateConfigUI() {
        const playerDisplay = document.getElementById('player-count-display');
        const undercoverDisplay = document.getElementById('undercover-count-display');
        const container = document.getElementById('player-inputs-container');
        const mrWhiteToggle = document.getElementById('toggle-mrwhite');

        if (playerDisplay) playerDisplay.textContent = this.state.playerCount;
        if (undercoverDisplay) undercoverDisplay.textContent = this.state.undercoverCount;
        if (mrWhiteToggle) mrWhiteToggle.checked = this.state.mrWhiteEnabled;

        // Render player name inputs (not for Duo)
        if (container && this.state.currentMode !== 'duo') {
            container.innerHTML = '';
            for (let i = 0; i < this.state.playerCount; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = `Joueur ${i + 1}`;
                input.value = this.state.players[i]?.name || '';
                input.dataset.playerIndex = i;
                container.appendChild(input);
            }
        }
    }

    adjustPlayers(amount) {
        this.state.updatePlayerCount(amount);
        this.updateConfigUI();
    }

    adjustUndercover(amount) {
        this.state.updateUndercoverCount(amount);
        this.updateConfigUI();
    }

    // Game Start Logic
    startGame() {
        // Gather player names
        const inputs = document.querySelectorAll('#player-inputs-container input');
        this.state.players = [];

        if (this.state.currentMode === 'duo') {
            // Fixed 2 players for Duo
            const p1Input = document.getElementById('duo-player1-name');
            const p2Input = document.getElementById('duo-player2-name');
            this.state.addPlayer(p1Input?.value.trim() || 'Joueur 1');
            this.state.addPlayer(p2Input?.value.trim() || 'Joueur 2');
        } else {
            inputs.forEach((input, i) => {
                this.state.addPlayer(input.value.trim() || `Joueur ${i + 1}`);
            });
        }

        // Get word pair
        const words = this.getRandomWordPair();
        if (!words) {
            alert("Aucune liste de mots disponible!");
            return;
        }

        this.state.setWordPair(words);
        this.state.assignRoles();

        // Navigate to reveal
        window.router.load('reveal');
    }

    getRandomWordPair() {
        // Get words from selected lists for current mode
        const availableWords = this.state.getAvailableWordPairs();

        if (availableWords && availableWords.length > 0) {
            const pair = availableWords[Math.floor(Math.random() * availableWords.length)];
            return {
                citizen: pair.word1,
                undercover: pair.word2,
                word1: pair.word1,
                word2: pair.word2,
                player1: pair.word1,
                player2: pair.word2
            };
        }

        // Fallback if no lists selected
        return { citizen: "Chien", undercover: "Chat", word1: "Chien", word2: "Chat" };
    }

    // Reveal Screen

    renderRevealScreen() {
        const player = this.state.players[this.state.currentPlayerIndex];
        if (!player) return;

        const nameEl = document.getElementById('reveal-player-name');
        const targetEl = document.getElementById('reveal-target-name');
        const card = document.getElementById('secret-card');

        if (nameEl) nameEl.textContent = player.name;
        if (targetEl) targetEl.textContent = player.name; // Simplified for now
        if (card) card.classList.remove('flipped');

        document.getElementById('btn-confirm-secret')?.classList.add('hidden');
    }

    revealCard() {
        const card = document.getElementById('secret-card');
        const player = this.state.players[this.state.currentPlayerIndex];
        const modeSettings = this.state.settings.modeSettings[this.state.currentMode];

        card.classList.add('flipped');

        // Show word
        const wordEl = document.getElementById('secret-word');
        const hintEl = document.getElementById('role-hint');

        if (player.role === 'MR_WHITE') {
            wordEl.textContent = '???';
            hintEl.textContent = 'Vous êtes Mr. White';
        } else if (player.role === 'UNDERCOVER' && modeSettings?.undercoverKnows) {
            wordEl.textContent = player.word;
            hintEl.textContent = 'Vous êtes Undercover !';
        } else {
            wordEl.textContent = player.word;
            hintEl.textContent = ''; // Don't reveal the role to the player!
        }

        document.getElementById('btn-confirm-secret')?.classList.remove('hidden');
    }

    confirmSecret() {
        this.state.playersRevealedCount++;
        this.state.currentPlayerIndex++;

        // Wrap around if needed
        if (this.state.currentPlayerIndex >= this.state.players.length) {
            this.state.currentPlayerIndex = 0;
        }

        if (this.state.playersRevealedCount >= this.state.players.length) {
            // All revealed, go to game
            // Reset current player to the first player (who started the reveal)
            this.state.currentPlayerIndex = this.state.firstPlayerIndex;
            window.router.load('game');
        } else {
            this.renderRevealScreen();
        }
    }

    // Game Screen
    renderGameScreen() {
        const list = document.getElementById('player-list');
        if (!list) return;

        list.innerHTML = '';
        this.state.getAlivePlayers().forEach(p => {
            const li = document.createElement('li');
            li.className = 'player-item';
            const span = document.createElement('span');
            span.textContent = p.name;
            li.appendChild(span);
            list.appendChild(li);
        });

        // Update stats
        const alive = this.state.getAlivePlayers();
        const undercovers = alive.filter(p => p.role === 'UNDERCOVER').length;
        const mrWhites = alive.filter(p => p.role === 'MR_WHITE').length;

        document.getElementById('undercover-remaining').textContent = '?'; // Hidden
        document.getElementById('mrwhite-remaining').textContent = mrWhites > 0 ? 'Oui' : 'Non';
    }

    // Vote Screen
    renderVoteScreen() {
        const grid = document.getElementById('vote-list');
        if (!grid) return;

        grid.innerHTML = '';
        this.state.getAlivePlayers().forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'btn-secondary';
            btn.textContent = p.name;
            btn.dataset.action = 'vote-player';
            btn.dataset.id = this.state.players.indexOf(p);
            grid.appendChild(btn);
        });

        // Show and start timer
        const timerEl = document.getElementById('vote-timer');
        const timerDisplay = document.getElementById('timer-display');
        const modeSettings = this.state.settings.modeSettings[this.state.currentMode];
        const voteTime = modeSettings?.voteTimer;

        if (timerEl && timerDisplay) {
            if (voteTime === 'unlimited') {
                timerEl.classList.add('hidden');
            } else {
                timerEl.classList.remove('hidden');
                timerDisplay.className = 'timer-normal'; // Reset class

                let timeLeft = voteTime || 60; // Default 60s
                timerDisplay.textContent = this.formatTime(timeLeft);

                // Web Audio Context for sounds
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioCtx = new AudioContext();

                const playTone = (freq, type = 'sine', duration = 0.1) => {
                    if (audioCtx.state === 'suspended') audioCtx.resume();
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = type;
                    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + duration);
                };

                // Clear any existing interval
                if (this.state.voteTimerInterval) clearInterval(this.state.voteTimerInterval);

                const interval = setInterval(() => {
                    timeLeft--;
                    timerDisplay.textContent = this.formatTime(timeLeft);

                    // Visual & Audio Logic
                    if (timeLeft <= 10 && timeLeft > 0) {
                        timerDisplay.className = 'timer-warning';
                        playTone(800, 'square', 0.1); // Urgent tick
                    } else if (timeLeft > 0) {
                        timerDisplay.className = 'timer-normal';
                        playTone(600, 'sine', 0.05); // Normal tick
                    }

                    if (timeLeft <= 0) {
                        clearInterval(interval);
                        playTone(400, 'sawtooth', 0.5); // End sound
                        timerDisplay.textContent = "Temps écoulé !";
                    }
                }, 1000);

                // Store interval to clear it later if needed
                this.state.voteTimerInterval = interval;
            }
        }

        // Add "Show Results" button
        const resultsBtn = document.createElement('button');
        resultsBtn.className = 'btn-primary';
        resultsBtn.textContent = 'Voir les résultats';
        resultsBtn.dataset.action = 'show-results';
        resultsBtn.style.marginTop = '20px';
        resultsBtn.style.width = '100%';
        const screen = document.querySelector('.vote-screen');
        if (screen) screen.appendChild(resultsBtn);
    }

    votePlayer(id) {
        const player = this.state.players[id];
        if (!player || !player.isAlive) return;

        if (!confirm(`Voulez-vous vraiment éliminer ${player.name} ?`)) return;

        this.state.eliminatePlayer(id);
        this.state.eliminatedPlayer = player;
        window.router.load('elimination');
    }

    showVoteResults() {
        alert("Sélectionnez le joueur éliminé");
    }

    renderEliminationScreen() {
        const player = this.state.eliminatedPlayer;
        if (!player) return;

        const title = document.getElementById('eliminated-title');
        const role = document.getElementById('eliminated-role');
        if (title) title.textContent = `${player.name} est éliminé !`;
        if (role) role.textContent = `Il était ${this.getRoleName(player.role)}`;

        const guessContainer = document.getElementById('mr-white-guess-container');
        const nextBtn = document.getElementById('btn-next-round');

        if (player.role === 'MR_WHITE') {
            guessContainer?.classList.remove('hidden');
            nextBtn?.classList.add('hidden');
        } else {
            guessContainer?.classList.add('hidden');
            nextBtn?.classList.remove('hidden');
        }
    }

    getRoleName(role) {
        const names = {
            'CITIZEN': 'Civil',
            'UNDERCOVER': 'Undercover',
            'MR_WHITE': 'Mr. White'
        };
        return names[role] || role;
    }

    handleMrWhiteGuess() {
        const input = document.getElementById('mr-white-input');
        const guess = input?.value.trim().toLowerCase();
        const citizenWord = this.state.currentWordPair.citizen.toLowerCase();

        if (!guess) return;

        if (!confirm(`Confirmer la supposition : "${guess}" ?`)) return;

        if (guess === citizenWord) {
            this.state.winner = 'mrwhite';
            window.router.load('gameover');
        } else {
            alert("Mauvaise réponse ! Mr. White perd.");
            this.nextRound();
        }
    }

    nextRound() {
        // Check win conditions
        const alive = this.state.getAlivePlayers();
        const undercovers = alive.filter(p => p.role === 'UNDERCOVER').length;
        const mrWhites = alive.filter(p => p.role === 'MR_WHITE').length;
        const citizens = alive.filter(p => p.role === 'CITIZEN').length;

        if (mrWhites === 0 && undercovers === 0) {
            this.state.winner = 'citizens';
            window.router.load('gameover');
        } else if (mrWhites + undercovers >= citizens) {
            this.state.winner = 'impostors';
            window.router.load('gameover');
        } else {
            window.router.load('game');
        }
    }

    renderGameOverScreen() {
        const winnerTitle = document.getElementById('winner-title');
        const winnerReason = document.getElementById('winner-reason');
        const rolesList = document.getElementById('roles-list');
        const restartBtn = document.getElementById('btn-restart');

        // Set Winner Title and Reason
        if (this.state.winner === 'citizens') {
            winnerTitle.textContent = 'Victoire des Civils !';
            if (winnerReason) winnerReason.textContent = "Tous les imposteurs ont été éliminés.";
        } else if (this.state.winner === 'mrwhite') {
            winnerTitle.textContent = 'Victoire de Mr. White !';
            if (winnerReason) winnerReason.textContent = "Mr. White a trouvé le mot secret !";
        } else {
            winnerTitle.textContent = 'Victoire des Imposteurs !';
            if (winnerReason) winnerReason.textContent = "Les imposteurs sont majoritaires ou Mr. White a survécu.";
        }

        // Update Restart Button Target
        if (restartBtn) {
            let target = 'mode-selection';
            if (this.state.currentMode === 'classic') target = 'mode-classic';
            else if (this.state.currentMode === 'duo') target = 'mode-duo';
            else if (this.state.currentMode === 'children') target = 'mode-children';
            else if (this.state.currentMode === 'hardcore') target = 'mode-hardcore';

            restartBtn.dataset.target = target;
        }

        const modeSettings = this.state.settings.modeSettings[this.state.currentMode];
        if (rolesList) {
            rolesList.innerHTML = '';

            // Only show roles if revealRoles is true
            if (modeSettings && !modeSettings.revealRoles) {
                rolesList.innerHTML = '<div class="instruction">Les rôles sont masqués pour ce mode.</div>';
            } else {
                this.state.players.forEach(p => {
                    const roleItem = document.createElement('div');
                    roleItem.className = 'role-item';

                    const roleName = document.createElement('span');
                    roleName.className = 'role-name';
                    roleName.textContent = p.name;

                    const roleInfo = document.createElement('div');
                    roleInfo.className = 'role-info';

                    const roleWord = document.createElement('div');
                    roleWord.className = 'role-word';
                    roleWord.textContent = p.word || '???';

                    const roleType = document.createElement('div');
                    roleType.className = 'role-type';
                    roleType.textContent = this.getRoleName(p.role);

                    roleInfo.appendChild(roleWord);
                    roleInfo.appendChild(roleType);
                    roleItem.appendChild(roleName);
                    roleItem.appendChild(roleInfo);
                    rolesList.appendChild(roleItem);
                });
            }
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(`${modalId}-modal`);
        if (modal) {
            if (modalId === 'word-lists') {
                this.renderGlobalWordLists();
            } else if (modalId === 'mode-settings') {
                this.renderModeSettings();
            } else if (modalId === 'mode-lists') {
                this.renderModeListsSelection();
            }
            modal.classList.remove('hidden');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(`${modalId}-modal`);
        if (modal) modal.classList.add('hidden');
    }

    saveSettings() {
        const langSelect = document.getElementById('setting-language');
        if (langSelect && window.setLanguage) {
            window.setLanguage(langSelect.value);
        }

        this.state.saveSettings();
        this.closeModal('settings');
    }

    renderGlobalWordLists() {
        const container = document.getElementById('lists-viewer-container');
        if (!container) return;

        container.innerHTML = '';

        if (typeof window.wordLists === 'undefined') {
            container.innerHTML = '<p>Erreur: Listes non chargées.</p>';
            return;
        }

        const modes = {
            'classic': 'Classique',
            'children': 'Enfants',
            'hardcore': 'Hardcore'
        };

        Object.entries(modes).forEach(([modeKey, modeName]) => {
            const section = document.createElement('div');
            section.className = 'list-section';
            section.innerHTML = `<h3>${modeName}</h3>`;

            const lists = Object.values(window.wordLists).filter(l => l.mode === modeKey);
            if (lists.length === 0) {
                section.innerHTML += '<p>Aucune liste.</p>';
            } else {
                const ul = document.createElement('ul');
                lists.forEach(l => {
                    if (!l.words) return;
                    const li = document.createElement('li');
                    li.textContent = `${l.name} (${l.words.length} paires)`;
                    ul.appendChild(li);
                });
                section.appendChild(ul);
            }
            container.appendChild(section);
        });
    }

    renderModeSettings() {
        const container = document.getElementById('mode-settings-content');
        if (!container) return;

        const mode = this.state.currentMode;
        const settings = this.state.settings.modeSettings[mode] || {};

        let html = '';

        const createRadioGroup = (name, options, selected) => {
            return `
                <div class="radio-group">
                    ${options.map(opt => `
                        <label class="radio-option">
                            <input type="radio" name="${name}" value="${opt.value}" ${String(selected) === String(opt.value) ? 'checked' : ''}>
                            <span>${opt.label}</span>
                        </label>
                    `).join('')}
                </div>
            `;
        };

        // === MODE CLASSIQUE ===
        if (mode === 'classic') {
            html = `
                <div class="setting-item">
                    <label>Autoriser Mr. White à commencer</label>
                    <label class="toggle-control">
                        <input type="checkbox" id="mode-mrwhite-starts" ${settings.mrWhiteCanStartFirst ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <label>Temps pour vote</label>
                    ${createRadioGroup('mode-vote-timer', [
                { value: '30', label: '30s' },
                { value: '45', label: '45s' },
                { value: '60', label: '60s' },
                { value: '90', label: '1m30' },
                { value: 'unlimited', label: 'Infini' }
            ], settings.voteTimer)}
                </div>
                <div class="setting-item">
                    <label>Révéler les rôles à la fin</label>
                    <label class="toggle-control">
                        <input type="checkbox" id="mode-reveal-roles" ${settings.revealRoles ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <label>Choix du premier joueur</label>
                    ${createRadioGroup('mode-first-player', [
                { value: 'player1', label: 'Joueur 1' },
                { value: 'random', label: 'Aléatoire' },
                { value: 'previousWinner', label: 'Gagnant préc.' }
            ], settings.firstPlayer)}
                </div>
                <div class="setting-item">
                    <label>Undercover sait qu'il est undercover</label>
                    <label class="toggle-control">
                        <input type="checkbox" id="mode-undercover-knows" ${settings.undercoverKnows ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            `;
        }

        // === MODE ENFANT ===
        else if (mode === 'children') {
            html = `
                <div class="setting-item">
                    <label>Autoriser Mr. White à commencer</label>
                    <label class="toggle-control">
                        <input type="checkbox" id="mode-mrwhite-starts" ${settings.mrWhiteCanStartFirst ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <label>Temps pour vote</label>
                    ${createRadioGroup('mode-vote-timer', [
                { value: '60', label: '60s' },
                { value: '90', label: '1m30' },
                { value: '120', label: '2m' },
                { value: '180', label: '3m' },
                { value: 'unlimited', label: 'Infini' }
            ], settings.voteTimer)}
                </div>
                <div class="setting-item">
                    <label>Révéler les rôles à la fin</label>
                    <label class="toggle-control">
                        <input type="checkbox" id="mode-reveal-roles" ${settings.revealRoles ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <label>Choix du premier joueur</label>
                    ${createRadioGroup('mode-first-player', [
                { value: 'player1', label: 'Joueur 1' },
                { value: 'random', label: 'Aléatoire' },
                { value: 'previousWinner', label: 'Gagnant préc.' },
                { value: 'previousDead', label: '1er mort préc.' }
            ], settings.firstPlayer)}
                </div>
                <div class="setting-item">
                    <label>Undercover sait qu'il est undercover</label>
                    <label class="toggle-control">
                        <input type="checkbox" id="mode-undercover-knows" ${settings.undercoverKnows ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            `;
        }

        // === MODE HARDCORE ===
        else if (mode === 'hardcore') {
            html = `
                <div class="setting-item">
                    <label>Autoriser Mr. White à commencer</label>
                    <label class="toggle-control">
                        <input type="checkbox" id="mode-mrwhite-starts" ${settings.mrWhiteCanStartFirst ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <label>Temps pour vote</label>
                    ${createRadioGroup('mode-vote-timer', [
                { value: '15', label: '15s' },
                { value: '30', label: '30s' },
                { value: '45', label: '45s' },
                { value: '60', label: '60s' },
                { value: 'unlimited', label: 'Infini' }
            ], settings.voteTimer)}
                </div>
                <div class="setting-item">
                    <label>Révéler les rôles à la fin</label>
                    <label class="toggle-control">
                        <input type="checkbox" id="mode-reveal-roles" ${settings.revealRoles ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <label>Choix du premier joueur</label>
                    ${createRadioGroup('mode-first-player', [
                { value: 'player1', label: 'Joueur 1' },
                { value: 'random', label: 'Aléatoire' },
                { value: 'previousWinner', label: 'Gagnant préc.' },
                { value: 'previousDead', label: '1er mort préc.' }
            ], settings.firstPlayer)}
                </div>
                <div class="setting-item">
                    <label>Undercover sait qu'il est undercover</label>
                    <label class="toggle-control">
                        <input type="checkbox" id="mode-undercover-knows" ${settings.undercoverKnows ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <label>Ordre de jeu</label>
                    ${createRadioGroup('mode-play-order', [
                { value: 'classic', label: 'Classique' },
                { value: 'random', label: 'Aléatoire' }
            ], settings.playOrder)}
                </div>
            `;
        }

        // === MODE DUO ===
        else if (mode === 'duo') {
            const duoSettings = settings;
            const subMode = duoSettings.subMode || 'classic';

            html = `
                <div class="setting-item">
                    <label>Sous-mode</label>
                    ${createRadioGroup('duo-submode', [
                { value: 'classic', label: 'Classique' },
                { value: 'chaos', label: 'Devinette' }
            ], subMode)}
                </div>
                <div id="duo-classic-settings" style="display: ${subMode === 'classic' ? 'block' : 'none'}">
                    <div class="setting-item">
                        <label>Nombre de tours</label>
                        ${createRadioGroup('duo-classic-rounds', [
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '6', label: '6' }
            ], duoSettings.classic?.rounds)}
                    </div>
                </div>
                <div id="duo-chaos-settings" style="display: ${subMode === 'chaos' ? 'block' : 'none'}">
                    <div class="setting-item">
                        <label>Nombre de tours max</label>
                        ${createRadioGroup('duo-chaos-maxrounds', [
                { value: '4', label: '4' },
                { value: '6', label: '6' },
                { value: '10', label: '10' }
            ], duoSettings.chaos?.maxRounds)}
                    </div>
                    <div class="setting-item">
                        <label>Nombre de guess max par joueur</label>
                        ${createRadioGroup('duo-chaos-guesses', [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' }
            ], duoSettings.chaos?.maxGuessesPerPlayer)}
                    </div>
                    <div class="setting-item">
                        <label>Qui commence</label>
                        ${createRadioGroup('duo-chaos-starts', [
                { value: 'random', label: 'Aléatoire' },
                { value: 'player1', label: 'J1' },
                { value: 'player2', label: 'J2' }
            ], duoSettings.chaos?.whoStarts)}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;

        // Add event listener for duo sub-mode change
        if (mode === 'duo') {
            const radios = document.querySelectorAll('input[name="duo-submode"]');
            radios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const classicDiv = document.getElementById('duo-classic-settings');
                    const chaosDiv = document.getElementById('duo-chaos-settings');
                    if (e.target.value === 'classic') {
                        classicDiv.style.display = 'block';
                        chaosDiv.style.display = 'none';
                    } else {
                        classicDiv.style.display = 'none';
                        chaosDiv.style.display = 'block';
                    }
                });
            });
        }
    }

    renderModeListsSelection() {
        const container = document.getElementById('mode-lists-container');
        if (!container) return;

        container.innerHTML = '';

        let targetMode = this.state.currentMode;
        if (targetMode === 'children') targetMode = 'enfants';
        if (targetMode === 'duo') targetMode = 'classique';

        if (typeof window.wordLists === 'undefined') return;

        const lists = Object.entries(window.wordLists).filter(([_, l]) => l.mode === targetMode);

        if (lists.length === 0) {
            container.innerHTML = '<p>Aucune liste disponible pour ce mode.</p>';
            return;
        }

        lists.forEach(([id, list]) => {
            if (!list.words) return;
            const div = document.createElement('div');
            div.className = 'setting-item';
            const isChecked = this.state.selectedLists[id] !== false;

            div.innerHTML = `
                <label>${list.name} (${list.words.length})</label>
                <label class="toggle-control">
                    <input type="checkbox" data-list-id="${id}" ${isChecked ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            `;
            container.appendChild(div);
        });
    }

    saveModeSettings() {
        const mode = this.state.currentMode;
        const settings = this.state.settings.modeSettings[mode];

        if (!settings) return;

        // Helper to get checked radio value
        const getRadioValue = (name) => {
            const checked = document.querySelector(`input[name="${name}"]:checked`);
            return checked ? checked.value : null;
        };

        // Common settings
        const voteTimerVal = getRadioValue('mode-vote-timer');
        if (voteTimerVal) {
            settings.voteTimer = voteTimerVal === 'unlimited' ? 'unlimited' : parseInt(voteTimerVal);
        }

        const revealCheck = document.getElementById('mode-reveal-roles');
        if (revealCheck) {
            settings.revealRoles = revealCheck.checked;
        }

        const whiteStartCheck = document.getElementById('mode-mrwhite-starts');
        if (whiteStartCheck) {
            settings.mrWhiteCanStartFirst = whiteStartCheck.checked;
        }

        const firstPlayerVal = getRadioValue('mode-first-player');
        if (firstPlayerVal) {
            settings.firstPlayer = firstPlayerVal;
        }

        const undercoverKnowsCheck = document.getElementById('mode-undercover-knows');
        if (undercoverKnowsCheck) {
            settings.undercoverKnows = undercoverKnowsCheck.checked;
        }

        // Hardcore specific
        if (mode === 'hardcore') {
            const playOrderVal = getRadioValue('mode-play-order');
            if (playOrderVal) {
                settings.playOrder = playOrderVal;
            }
        }

        // Duo specific
        if (mode === 'duo') {
            const subModeVal = getRadioValue('duo-submode');
            if (subModeVal) {
                settings.subMode = subModeVal;
            }

            if (settings.subMode === 'classic') {
                const roundsVal = getRadioValue('duo-classic-rounds');
                if (roundsVal) {
                    settings.classic.rounds = parseInt(roundsVal);
                }
            } else {
                const maxRoundsVal = getRadioValue('duo-chaos-maxrounds');
                if (maxRoundsVal) {
                    settings.chaos.maxRounds = parseInt(maxRoundsVal);
                }

                const guessesVal = getRadioValue('duo-chaos-guesses');
                if (guessesVal) {
                    settings.chaos.maxGuessesPerPlayer = parseInt(guessesVal);
                }

                const startsVal = getRadioValue('duo-chaos-starts');
                if (startsVal) {
                    settings.chaos.whoStarts = startsVal;
                }
            }
        }

        this.state.saveSettings();
        this.closeModal('mode-settings');
    }

    saveModeLists() {
        const checkboxes = document.querySelectorAll('#mode-lists-container input[type="checkbox"]');
        checkboxes.forEach(cb => {
            if (cb.dataset.listId) {
                this.state.selectedLists[cb.dataset.listId] = cb.checked;
            }
        });
        this.state.saveSelectedLists();
        this.closeModal('mode-lists');
    }

    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
}
