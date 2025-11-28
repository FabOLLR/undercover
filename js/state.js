export class GameState {
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
            firstPlayer: 'random',
            soundEnabled: true,
            vibrationEnabled: true,
            previousWinner: null,
            // Mode-specific settings
            modeSettings: {
                classic: {
                    mrWhiteCanStartFirst: false,
                    voteTimer: 60,
                    revealRoles: true,
                    firstPlayer: 'random',
                    undercoverKnows: false
                },
                children: {
                    mrWhiteCanStartFirst: false,
                    voteTimer: 90,
                    revealRoles: true,
                    firstPlayer: 'random',
                    undercoverKnows: false
                },
                hardcore: {
                    mrWhiteCanStartFirst: true,
                    voteTimer: 30,
                    revealRoles: true,
                    firstPlayer: 'random',
                    undercoverKnows: false,
                    playOrder: 'classic'
                },
                duo: {
                    subMode: 'classic', // 'classic' or 'chaos'
                    classic: {
                        rounds: 6
                    },
                    chaos: {
                        maxRounds: 6,
                        maxGuessesPerPlayer: 3,
                        whoStarts: 'random'
                    }
                }
            }
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
        this.playerCount = Math.max(3, Math.min(20, count));
    }

    setUndercoverCount(count) {
        const max = this.getMaxUndercoverCount();
        this.undercoverCount = Math.max(1, Math.min(max, count));
    }

    getMaxUndercoverCount() {
        // Max undercover based on player count
        const mrWhiteSlot = this.mrWhiteEnabled ? 1 : 0;
        return Math.floor((this.playerCount - mrWhiteSlot - 1) / 2);
    }

    updatePlayerCount(change) {
        let newCount = this.playerCount + change;

        if (this.currentMode === 'duo') {
            newCount = 2;
        } else {
            newCount = Math.max(3, Math.min(20, newCount));
        }

        this.playerCount = newCount;

        // Auto-adjust undercover if needed
        const maxUndercover = this.getMaxUndercoverCount();
        if (this.undercoverCount > maxUndercover) {
            this.undercoverCount = Math.max(1, maxUndercover);
        }

        return this.playerCount;
    }

    updateUndercoverCount(change) {
        if (this.currentMode === 'duo') return 0;

        let newCount = this.undercoverCount + change;
        const maxUndercover = this.getMaxUndercoverCount();

        this.undercoverCount = Math.max(1, Math.min(maxUndercover, newCount));
        return this.undercoverCount;
    }

    setMrWhiteEnabled(enabled) {
        this.mrWhiteEnabled = enabled;
        // Re-validate undercover count
        const maxUndercover = this.getMaxUndercoverCount();
        if (this.undercoverCount > maxUndercover) {
            this.undercoverCount = Math.max(1, maxUndercover);
        }
    }

    setWordPair(wordPair) {
        this.currentWordPair = wordPair;
    }

    assignRoles() {
        if (!this.currentWordPair) return;

        let roles = [];
        const total = this.playerCount;

        // Define Roles based on Mode
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

        // Shuffle Roles
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roles[i], roles[j]] = [roles[j], roles[i]];
        }

        // Mr White Player 1 Constraint
        const modeSettings = this.settings.modeSettings[this.currentMode];
        if (!modeSettings?.mrWhiteCanStartFirst && roles[0] === 'MR_WHITE' && total > 1) {
            const swapIdx = roles.findIndex((r, i) => i > 0 && r !== 'MR_WHITE');
            if (swapIdx !== -1) {
                [roles[0], roles[swapIdx]] = [roles[swapIdx], roles[0]];
            }
        }

        // Assign Roles and Words to Players
        this.players = this.players.map((player, index) => {
            const role = roles[index];
            let word = null;

            if (this.currentMode === 'duo') {
                word = index === 0 ? this.currentWordPair.player1 || this.currentWordPair.citizen :
                    this.currentWordPair.player2 || this.currentWordPair.undercover;
            } else if (this.currentMode === 'hardcore' && role === 'UNDERCOVER') {
                // Hardcore: Undercovers can have different words
                const ucIndex = roles.slice(0, index).filter(r => r === 'UNDERCOVER').length;
                word = ucIndex === 0 ? this.currentWordPair.undercover :
                    (this.currentWordPair.undercover2 || this.currentWordPair.undercover);
            } else {
                if (role === 'CITIZEN') word = this.currentWordPair.citizen || this.currentWordPair.word1;
                else if (role === 'UNDERCOVER') word = this.currentWordPair.undercover || this.currentWordPair.word2;
                else if (role === 'MR_WHITE') word = null;
            }

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

        this.currentPlayerIndex = this.determineFirstPlayer();
        this.firstPlayerIndex = this.currentPlayerIndex;
        this.playersRevealedCount = 0;
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

        if (typeof window.wordLists === 'undefined') return [];

        Object.keys(this.selectedLists).forEach(listId => {
            if (this.selectedLists[listId] && window.wordLists[listId]) {
                if (window.wordLists[listId].mode === targetMode) {
                    allWords = allWords.concat(window.wordLists[listId].words);
                }
            }
        });
        return allWords;
    }

    determineFirstPlayer() {
        const modeSettings = this.settings.modeSettings[this.currentMode];
        const firstPlayerSetting = modeSettings?.firstPlayer || 'random';

        switch (firstPlayerSetting) {
            case 'random':
                return Math.floor(Math.random() * this.players.length);
            case 'previousWinner':
                if (this.settings.previousWinner) {
                    const idx = this.players.findIndex(p => p.name === this.settings.previousWinner);
                    return idx !== -1 ? idx : Math.floor(Math.random() * this.players.length);
                }
                return Math.floor(Math.random() * this.players.length);
            case 'previousDead':
                // Not yet implemented, fallback to random
                return Math.floor(Math.random() * this.players.length);
            case 'player1':
            default:
                return 0;
        }
    }

    checkWinCondition() {
        const alive = this.getAlivePlayers();
        const undercovers = alive.filter(p => p.role === 'UNDERCOVER').length;
        const mrWhites = alive.filter(p => p.role === 'MR_WHITE').length;
        const citizens = alive.filter(p => p.role === 'CITIZEN').length;
        const impostors = undercovers + mrWhites;

        // All impostors eliminated
        if (impostors === 0) return 'citizens';

        // Impostors win conditions
        if (impostors >= citizens) {
            // Check special cases
            if (mrWhites === 1 && citizens === 1 && undercovers === 0) return 'mrwhite';
            return 'impostors';
        }

        return null; // Game continues
    }
}
