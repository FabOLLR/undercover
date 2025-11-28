const translations_en = {
    // Setup Screen
    setup: {
        title: "Configuration",
        settings: "⚙️ Settings",
        playerCount: "Player Count",
        undercoverCount: "Undercover Count",
        mrWhite: "Mr. White?",
        startGame: "Start Game"
    },

    // Home Screen
    home: {
        newGame: "New Game",
        rules: "Rules",
        settings: "Settings",
        wordLists: "Word Lists"
    },

    // Mode Selection
    modeSelection: {
        title: "Choose a mode"
    },
    modes: {
        classic: "Classic",
        duo: "Duo",
        children: "Children",
        hardcore: "Hardcore"
    },

    // Duo Selection
    duoSelection: {
        title: "Duo Mode",
        subtitle: "Choose your duel style",
        classicTitle: "Classic Duo",
        classicDesc: "Similar words",
        chaosTitle: "Chaos Duo",
        chaosDesc: "Totally different words"
    },

    // Settings Modal
    settings: {
        title: "Settings",
        wordLists: "📚 Word Lists",
        parameters: "⚙️ Parameters",
        save: "Save",
        rules: "📜 Rules",
        credits: "Credits",

        // Rules Tab
        rulesTab: {
            goalTitle: "Goal",
            goal: "Unmask the impostors (Undercover and Mr. White) before they eliminate you!",
            rolesTitle: "Roles",
            citizen: "Citizen: You have the same secret word as other Citizens.",
            undercover: "Undercover: You have a slightly different word.",
            mrWhite: "Mr. White: You have no word at all.",
            turnTitle: "Gameplay",
            turn: "Take turns giving a one-word clue related to your secret word. Mr. White must improvise by listening to others.",
            voteTitle: "Vote & Elimination",
            vote: "After the round, discuss and vote to eliminate the most suspicious player.",
            winTitle: "Win Conditions",
            winCitizen: "Citizens: Eliminate all impostors.",
            winImpostor: "Impostors: Survive until you hold the majority (or 2 players left).",
            winMrWhite: "Mr. White: If eliminated, you have one last chance by guessing the Citizens' word!",
            duoTitle: "Duo Rules",
            duoClassic: "Classic Duo: 1 Citizen vs 1 Undercover. Words are very similar.",
            duoChaos: "Chaos Duo: 2 completely different words. Bluff to make them believe you have the same word!",
            hardcoreTitle: "Hardcore Rules",
            hardcoreDesc1: "Words are triplets (e.g., Lion, Tiger, Leopard).",
            hardcoreDesc2: "If there are 2 Undercovers, they might have different words!"
        },

        // Word Lists
        wordListsDescription: "Select word categories to use",

        // Global Settings
        globalSettings: "🌍 Global Settings",
        uiLanguage: "Interface Language",
        wordsLanguage: "Words Language",

        // Mr. White
        mrWhiteSection: "👤 Mr. White",
        mrWhitePlayer1: "Allow Mr. White as Player 1",

        // Vote Timer
        voteTimerSection: "⏱️ Vote Timer",
        timer30: "30 seconds",
        timer45: "45 seconds",
        timer60: "60 seconds",
        timerUnlimited: "Unlimited",

        // Role Reveal
        roleRevealSection: "👁️ Reveal Roles",
        showRoles: "Show all roles at the end",

        // Game Mode
        gameModeSection: "🎮 Game Mode",
        quickMode: "Quick (undercover win on strict majority)",
        longMode: "Long (until 2 players remain)",

        // First Player
        firstPlayerSection: "🎯 First Player Choice",
        alwaysPlayer1: "Always Player 1",
        random: "Random",
        previousWinner: "Previous game winner",

        // Sound
        soundSection: "🔊 Sound & Vibration",
        sound: "Sounds",
        vibration: "Vibration"
    },

    // Reveal Screen
    reveal: {
        passTo: "Pass the phone to",
        viewSecret: "View my secret word",
        confirmed: "Got it!",
        youAreMrWhite: "You are Mr. White",
        mrWhiteHint: "You don't have a word. Improvise!",
        memorize: "Memorize your secret word."
    },

    // Game Screen
    game: {
        title: "Round Table",
        instruction: "Everyone gives a clue.",
        undercoverRemaining: "Undercover remaining:",
        mrWhitePresent: "Mr. White:",
        startVote: "Start Vote"
    },

    // Vote Screen
    vote: {
        title: "Vote",
        instruction: "Who is the impostor?"
    },

    // Elimination Screen
    elimination: {
        eliminated: "is eliminated!",
        wasCitizen: "They were a Citizen.",
        wasUndercover: "They were an Undercover!",
        wasMrWhite: "They were Mr. White!",
        mrWhiteGuess: "Mr. White, try to guess the Citizens' word!",
        guessPlaceholder: "Your guess...",
        validate: "Submit",
        wrongGuess: "Wrong guess!",
        nextRound: "Next Round"
    },

    // Game Over Screen
    gameover: {
        victory: "Victory!",
        citizensWin: "Citizens Win!",
        impostorsWin: "Impostors Win!",
        mrWhiteWin: "Mr. White Wins!",
        allImpostorsEliminated: "All impostors have been eliminated.",
        impostorsMajority: "They hold the majority.",
        mrWhiteGuessed: "They found the hidden word:",
        rolesTitle: "Player Roles",
        replay: "Play Again"
    },

    // Roles
    roles: {
        CITIZEN: "Citizen",
        UNDERCOVER: "Undercover",
        MR_WHITE: "Mr. White"
    },

    // Player
    player: "Player",

    // Languages
    languages: {
        fr: "Français",
        en: "English",
        es: "Español"
    }
};
