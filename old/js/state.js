class GameState {
    constructor() {
        this.players = [];
        this.currentWordPair = null;
        this.currentPlayerIndex = 0;
        this.firstPlayerIndex = 0;
        this.state = 'HOME';
        this.mrWhiteEnabled = true;
        this.playerCount = 6;
        this.undercoverCount = 1;
        this.voteTimerInterval = null;
        this.voteTimeRemaining = 0;
        this.currentMode = 'classic';
        this.currentSubMode = null;
        this.previousWinner = null;

        this.settings = this.loadSettings();
        this.selectedLists = this.loadSelectedLists();
    }

    loadSettings() {
        const saved = localStorage.getItem('undercoverSettings');
        const defaults = {
            language: 'fr',
            wordsLanguage: 'fr',
            mrWhitePlayer1: false,
            voteTimer: 'unlimited',
            revealRoles: true,
            gameMode: 'quick',
            firstPlayer: 'player1',
            soundEnabled: true,
            vibrationEnabled: true,
            previousWinner: null
        };
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    }

    saveSettings() {
        localStorage.setItem('undercoverSettings', JSON.stringify(this.settings));
    }

    loadSelectedLists() {
        const saved = localStorage.getItem('selectedWordLists');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            'classique': true,
            'films': true,
            'cuisine': true,
            'sports': true,
            'culture': true,
            'jeux': true,
            'enfants-animaux': true,
            'enfants-objets': true,
            'enfants-aliments': true,
            'hardcore-animaux': true,
            'hardcore-objets': true
        };
    }

    saveSelectedLists() {
        localStorage.setItem('selectedWordLists', JSON.stringify(this.selectedLists));
    }

    resetGame() {
        this.players = [];
        this.currentWordPair = null;
        this.currentPlayerIndex = 0;
        this.firstPlayerIndex = 0;
        this.state = 'HOME';
        this.voteTimerInterval && clearInterval(this.voteTimerInterval);
        this.voteTimerInterval = null;
        this.voteTimeRemaining = 0;
    }

    addPlayer(name) {
        this.players.push({
            name,
            role: 'CITIZEN',
            isAlive: true,
            word: null,
        });
    }

    setPlayerCount(count) {
        this.playerCount = Math.max(3, Math.min(12, count));
    }

    setUndercoverCount(count) {
        this.undercoverCount = Math.max(1, Math.min(this.playerCount - 2, count));
    }

    updatePlayerCount(change) {
        let newCount = this.playerCount + change;

        // Constraints based on mode
        if (this.currentMode === 'duo') {
            newCount = 2;
        } else {
            if (newCount < 3) newCount = 3;
            if (newCount > 20) newCount = 20;
        }

        this.playerCount = newCount;

        // Adjust undercover count if needed
        if (this.currentMode !== 'duo') {
            const maxUndercover = Math.floor((this.playerCount - (this.mrWhiteEnabled ? 1 : 0)) / 2);
            if (this.undercoverCount > maxUndercover) {
                this.undercoverCount = Math.max(1, maxUndercover);
            }
        }

        return this.playerCount;
    }

    updateUndercoverCount(change) {
        if (this.currentMode === 'duo') return 0;

        let newCount = this.undercoverCount + change;
        const maxUndercover = Math.floor((this.playerCount - (this.mrWhiteEnabled ? 1 : 0)) / 2);

        if (newCount < 1) newCount = 1;
        if (newCount > maxUndercover) newCount = maxUndercover;

        this.undercoverCount = newCount;
        return this.undercoverCount;
    }

    setMrWhiteEnabled(enabled) {
        this.mrWhiteEnabled = enabled;
    }

    setWordPair(wordPair) {
        this.currentWordPair = wordPair;
    }

    assignRoles() {
        if (!this.currentWordPair) return;

        let roles = [];
        const total = this.playerCount;

        // 1. Define Roles based on Mode
        if (this.currentMode === 'duo') {
            roles = ['CITIZEN', 'UNDERCOVER'];
        } else {
            const undercovers = this.undercoverCount;
            const mrWhite = this.mrWhiteEnabled ? 1 : 0;
            const citizens = total - undercovers - mrWhite;

            roles.push(...Array(citizens).fill('CITIZEN'));
            roles.push(...Array(undercovers).fill('UNDERCOVER'));
            roles.push(...Array(mrWhite).fill('MR_WHITE'));
        }

        // 2. Shuffle Roles
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roles[i], roles[j]] = [roles[j], roles[i]];
        }

        // 3. Mr White Player 1 Constraint
        if (!this.settings.mrWhitePlayer1 && roles[0] === 'MR_WHITE' && total > 1) {
            const swapIdx = roles.findIndex((r, i) => i > 0 && r !== 'MR_WHITE');
            if (swapIdx !== -1) {
                [roles[0], roles[swapIdx]] = [roles[swapIdx], roles[0]];
            }
        }

        // 4. Assign Roles and Words to Players
        this.players = this.players.map((player, index) => {
            const role = roles[index];
            let word = null;

            if (this.currentMode === 'duo') {
                // Duo Mode: Player 1 gets word1, Player 2 gets word2 (or vice versa based on role if needed, but usually fixed positions in duo)
                // Actually, in Duo, one is Citizen (word1), one is Undercover (word2)
                if (role === 'CITIZEN') word = this.currentWordPair.citizen;
                else if (role === 'UNDERCOVER') word = this.currentWordPair.undercover;

                // If Duo Chaos/Specific logic needed:
                // In main.js it was: i === 0 ? player1 : player2. 
                // Let's stick to standard role-based word assignment for consistency unless Duo has special needs.
                // Re-reading main.js logic: "word = i === 0 ? this.state.currentWordPair.player1 : this.state.currentWordPair.player2;"
                // This implies Duo words are stored in player1/player2 props, not citizen/undercover.
                if (this.currentWordPair.player1) {
                    word = index === 0 ? this.currentWordPair.player1 : this.currentWordPair.player2;
                }

            } else if (this.currentMode === 'hardcore' && role === 'UNDERCOVER') {
                // Hardcore: Undercovers might have different words
                // Count how many undercovers before this one
                const ucIndex = roles.slice(0, index).filter(r => r === 'UNDERCOVER').length;
                word = ucIndex === 0 ? this.currentWordPair.undercover : (this.currentWordPair.undercover2 || this.currentWordPair.undercover);
            } else {
                // Standard Modes
                if (role === 'CITIZEN') word = this.currentWordPair.citizen || '???';
                else if (role === 'UNDERCOVER') word = this.currentWordPair.undercover || '???';
                else if (role === 'MR_WHITE') word = null;
            }

            // Fallback if word is still null/undefined for non-Mr White
            if (role !== 'MR_WHITE' && !word) {
                word = '???';
                console.error('Word assignment failed for role:', role);
            }

            return {
                ...player,
                role,
                word,
                isAlive: true
            };
        });

        this.currentPlayerIndex = 0;
        this.firstPlayerIndex = 0;
        this.state = 'REVEAL';
    }

    getAlivePlayers() {
        return this.players.filter(player => player.isAlive);
    }

    eliminatePlayer(index) {
        if (this.players[index]) {
            this.players[index].isAlive = false;
        }
    }

    setState(newState) {
        this.state = newState;
    }

    setVoteTimer(seconds) {
        if (seconds === 'unlimited') {
            this.voteTimeRemaining = 0;
            return;
        }
        this.voteTimeRemaining = seconds;
    }

    decrementVoteTimer() {
        if (this.voteTimeRemaining > 0) {
            this.voteTimeRemaining--;
        }
        return this.voteTimeRemaining;
    }

    setCurrentMode(mode) {
        this.currentMode = mode;
    }

    setCurrentSubMode(subMode) {
        this.currentSubMode = subMode;
    }

    setPreviousWinner(playerName) {
        this.previousWinner = playerName;
        this.settings.previousWinner = playerName;
        this.saveSettings();
    }

    getAvailableWordPairs() {
        let allWords = [];
        let targetMode = this.currentMode;

        if (this.currentMode === 'children') targetMode = 'enfants';
        if (this.currentMode === 'hardcore') targetMode = 'hardcore';
        if (this.currentMode === 'duo') targetMode = 'classic';

        if (typeof wordLists === 'undefined') return [];

        Object.keys(this.selectedLists).forEach(listId => {
            if (this.selectedLists[listId] && wordLists[listId]) {
                if (wordLists[listId].mode === targetMode) {
                    allWords = allWords.concat(wordLists[listId].words);
                }
            }
        });
        return allWords;
    }

    determineFirstPlayer() {
        switch (this.settings.firstPlayer) {
            case 'random':
                return Math.floor(Math.random() * this.players.length);
            case 'previous':
                if (this.settings.previousWinner) {
                    const idx = this.players.findIndex(p => p.name === this.settings.previousWinner);
                    return idx !== -1 ? idx : 0;
                }
                return 0;
            case 'player1':
            default:
                return 0;
        }
    }

    getAvailableWords() {
        return this.getAvailableWordPairs();
    }
}
