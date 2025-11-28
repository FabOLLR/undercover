class UIManager {
    constructor() {
        this.screens = {
            home: document.getElementById('screen-home'),
            modeSelection: document.getElementById('screen-mode-selection'),
            duoSelection: document.getElementById('screen-duo-selection'),
            setup: document.getElementById('screen-setup'),
            reveal: document.getElementById('screen-reveal'),
            game: document.getElementById('screen-game'),
            vote: document.getElementById('screen-vote'),
            elimination: document.getElementById('screen-elimination'),
            gameover: document.getElementById('screen-gameover'),
            wordListsDisplay: document.getElementById('screen-word-lists-display')
        };

        this.elements = {
            playerInputsContainer: document.getElementById('player-inputs-container'),
            playerCountDisplay: document.getElementById('player-count-display'),
            undercoverCountDisplay: document.getElementById('undercover-count-display'),
            mrWhiteToggle: document.getElementById('toggle-mrwhite'),
            revealPlayerName: document.getElementById('reveal-player-name'),
            revealTargetName: document.getElementById('reveal-target-name'),
            secretCard: document.getElementById('secret-card'),
            secretWord: document.getElementById('secret-word'),
            roleHint: document.getElementById('role-hint'),
            confirmSecretBtn: document.getElementById('btn-confirm-secret'),
            playerList: document.getElementById('player-list'),
            voteList: document.getElementById('vote-list'),
            eliminatedTitle: document.getElementById('eliminated-title'),
            eliminatedRole: document.getElementById('eliminated-role'),
            mrWhiteGuessContainer: document.getElementById('mr-white-guess-container'),
            mrWhiteInput: document.getElementById('mr-white-input'),
            winnerTitle: document.getElementById('winner-title'),
            winnerReason: document.getElementById('winner-reason'),
            mrWhiteRemaining: document.getElementById('mrwhite-remaining'),
            undercoverRemaining: document.getElementById('undercover-remaining'),
            wordListsContainer: document.getElementById('word-lists-container'),
            allWordListsContainer: document.getElementById('all-word-lists-container'),
            settingsModal: document.getElementById('settings-modal'),
            languageSelect: document.getElementById('setting-language'),
            wordsLanguageSelect: document.getElementById('setting-words-language'),
            mrWhitePlayer1Toggle: document.getElementById('setting-mrwhite-player1'),
            voteTimerRadios: document.querySelectorAll('input[name="vote-timer"]'),
            revealRolesToggle: document.getElementById('setting-reveal-roles'),
            gameModeRadios: document.querySelectorAll('input[name="game-mode"]'),
            firstPlayerRadios: document.querySelectorAll('input[name="first-player"]'),
            soundToggle: document.getElementById('setting-sound'),
            vibrationToggle: document.getElementById('setting-vibration'),
            saveSettingsButton: document.getElementById('btn-save-settings'),
            creditsButton: document.getElementById('btn-credits'),
            closeSettingsButton: document.getElementById('btn-close-settings'),
            tabs: document.querySelectorAll('.tab-btn'),
            tabContents: document.querySelectorAll('.tab-content'),
            voteTimer: document.getElementById('vote-timer'),
            timerDisplay: document.getElementById('timer-display'),
        };
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });

        const target = this.screens[screenName];
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }
    }

    updateSetupUI(state) {
        this.elements.playerCountDisplay.innerText = state.playerCount;
        this.elements.undercoverCountDisplay.innerText = state.undercoverCount;
        this.elements.mrWhiteToggle.checked = state.mrWhiteEnabled;

        this.elements.playerInputsContainer.innerHTML = '';

        for (let i = 0; i < state.playerCount; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `${translations[currentLanguage].player} ${i + 1}`;
            input.dataset.index = i;
            this.elements.playerInputsContainer.appendChild(input);
        }

        const undercoverContainer = document.getElementById('setup-undercover-container');
        const mrWhiteContainer = document.getElementById('setup-mrwhite-container');

        if (state.currentMode === 'duo') {
            undercoverContainer.classList.add('hidden');
            mrWhiteContainer.classList.add('hidden');
        } else {
            undercoverContainer.classList.remove('hidden');
            mrWhiteContainer.classList.remove('hidden');
        }
    }

    renderRevealScreen(player, isCurrentPlayer, nextPlayerName) {
        this.elements.revealPlayerName.innerText = player.name;
        this.elements.revealTargetName.innerText = nextPlayerName || '';

        this.elements.secretCard.classList.remove('flipped');
        this.elements.secretWord.innerText = '???';
        this.elements.roleHint.innerText = '';
        this.elements.confirmSecretBtn.classList.add('hidden');
    }

    showSecret(player, wordPair) {
        this.elements.secretCard.classList.add('flipped');

        if (player.role === 'MR_WHITE') {
            this.elements.secretWord.innerText = translations[currentLanguage].reveal.youAreMrWhite;
            this.elements.secretWord.style.fontSize = '1.8rem';
            this.elements.roleHint.innerText = translations[currentLanguage].reveal.mrWhiteHint;
        } else {
            this.elements.secretWord.style.fontSize = '';
            if (wordPair.mode === 'duo-classic' || wordPair.mode === 'duo-chaos') {
                this.elements.secretWord.innerText = player.word || '???';
            } else {
                this.elements.secretWord.innerText = player.word || '???';
            }
            this.elements.roleHint.innerText = '';
        }

        this.elements.confirmSecretBtn.classList.remove('hidden');
    }

    updateGameScreen(state) {
        const alive = state.players.filter(p => p.isAlive);
        const undercovers = alive.filter(p => p.role === 'UNDERCOVER').length;
        const mrWhite = alive.filter(p => p.role === 'MR_WHITE').length;

        this.elements.undercoverRemaining.innerText = undercovers;
        this.elements.mrWhiteRemaining.innerText = mrWhite > 0 ? '✔️' : '✖️';

        this.elements.playerList.innerHTML = '';

        alive.forEach(player => {
            const li = document.createElement('li');
            li.className = 'player-item';
            li.innerHTML = `
                <div class="player-avatar">${player.name[0].toUpperCase()}</div>
                <div class="player-name">${player.name}</div>
            `;
            this.elements.playerList.appendChild(li);
        });
    }

    renderVoteScreen(players, onVote) {
        this.elements.voteList.innerHTML = '';

        players.filter(p => p.isAlive).forEach(player => {
            const btn = document.createElement('button');
            btn.className = 'vote-btn';
            btn.innerHTML = `
                <div class="player-avatar">${player.name[0].toUpperCase()}</div>
                <div class="player-name">${player.name}</div>
            `;
            btn.onclick = () => onVote(player);
            this.elements.voteList.appendChild(btn);
        });
    }

    showElimination(player, role, isMrWhiteGuess = false) {
        this.elements.eliminatedTitle.innerText =
            `${player.name} ${translations[currentLanguage].elimination.eliminated}`;
        this.elements.eliminatedRole.innerText = translations[currentLanguage].roles[role] || role;

        if (role === 'MR_WHITE') {
            this.elements.mrWhiteGuessContainer.classList.remove('hidden');
        } else {
            this.elements.mrWhiteGuessContainer.classList.add('hidden');
        }
    }

    showGameOver(reason, winner, players, wordPair) {
        const t = translations[currentLanguage];
        if (reason === 'CITIZENS_WIN') {
            this.elements.winnerTitle.innerText = t.gameover.citizensWin;
            this.elements.winnerReason.innerText = t.gameover.citizensReason;
        } else if (reason === 'IMPOSTORS_WIN') {
            this.elements.winnerTitle.innerText = t.gameover.impostorsWin;
            this.elements.winnerReason.innerText = t.gameover.impostorsReason;
        } else if (reason === 'MR_WHITE_GUESS') {
            this.elements.winnerTitle.innerText = t.gameover.mrWhiteWin;
            this.elements.winnerReason.innerText = t.gameover.mrWhiteReason;
        } else {
            this.elements.winnerTitle.innerText = t.gameover.victory;
            this.elements.winnerReason.innerText = '...';
        }

        this.elements.rolesList.innerHTML = '';
        players.forEach(player => {
            const div = document.createElement('div');
            div.className = 'role-item';
            div.innerHTML = `
                <div class="role-name">${player.name}</div>
                <div class="role-info">
                    <div class="role-word">${player.word || '❓'}</div>
                    <div class="role-type">${translations[currentLanguage].roles[player.role] || player.role}</div>
                </div>
            `;
            this.elements.rolesList.appendChild(div);
        });
    }

    renderWordLists(selectedLists, toggleCallback) {
        if (!this.elements.wordListsContainer) return;
        if (typeof wordLists === 'undefined') return;

        this.elements.wordListsContainer.innerHTML = '';

        Object.keys(wordLists).forEach(listId => {
            const list = wordLists[listId];

            const option = document.createElement('div');
            option.className = 'word-list-option';
            if (selectedLists[listId]) option.classList.add('selected');

            option.dataset.listId = listId;

            option.innerHTML = `
                <div class="list-info">
                    <div class="list-icon">${list.icon || '📚'}</div>
                    <div class="list-details">
                        <h4>${list.name}</h4>
                        <p>${list.description || ''}</p>
                        <p>${list.words.length} paires</p>
                    </div>
                </div>
                <div class="checkbox-indicator"></div>
            `;

            option.onclick = () => {
                const enabled = !selectedLists[listId];
                toggleCallback(listId, enabled);
            };

            this.elements.wordListsContainer.appendChild(option);
        });
    }

    renderAllWordLists() {
        if (!this.elements.allWordListsContainer) return;
        if (typeof wordLists === 'undefined') return;

        this.elements.allWordListsContainer.innerHTML = '';

        const categories = {
            classic: [],
            children: [],
            hardcore: []
        };

        Object.keys(wordLists).forEach(listId => {
            const list = wordLists[listId];
            if (list.mode === 'classic') categories.classic.push(list);
            else if (list.mode === 'enfants') categories.children.push(list);
            else if (list.mode === 'hardcore') categories.hardcore.push(list);
        });

        const createCategory = (title, icon, lists) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'word-list-category';

            categoryDiv.innerHTML = `
                <h3><span>${icon}</span> ${title}</h3>
                <div class="word-list-items"></div>
            `;

            const itemsContainer = categoryDiv.querySelector('.word-list-items');

            lists.forEach(list => {
                const sample = list.words.slice(0, 8);
                sample.forEach(pair => {
                    const item = document.createElement('div');
                    item.className = 'word-pair-item';
                    item.innerText = `${pair.word1} / ${pair.word2}`;
                    itemsContainer.appendChild(item);
                });
            });

            this.elements.allWordListsContainer.appendChild(categoryDiv);
        };

        createCategory('Classique', '🎮', categories.classic);
        createCategory('Enfants', '🧒', categories.children);
        createCategory('Hardcore', '💀', categories.hardcore);
    }

    toggleSettingsModal(show, mode = 'default') {
        if (show) {
            this.elements.settingsModal.classList.remove('hidden');
            this.elements.settingsModal.classList.remove('home-settings-view', 'rules-view');

            if (mode === 'rules' || mode === 'home-rules') {
                this.elements.settingsModal.classList.add('rules-view');
                this.switchTab('rules');
            } else if (mode === 'home-settings') {
                this.elements.settingsModal.classList.add('home-settings-view');
                this.switchTab('settings');
            }
        } else {
            this.elements.settingsModal.classList.add('hidden');
        }
    }

    switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');
        document.getElementById(`tab-${tabId}`)?.classList.add('active');
    }

    // Memorise le mode courant côté UI (utile pour du routing dynamique plus tard)
    setCurrentMode(mode) {
        this.currentMode = mode;
    }
}
