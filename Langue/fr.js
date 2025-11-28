const translations_fr = {
    // Setup Screen
    setup: {
        title: "Configuration",
        settings: "⚙️ Paramètres",
        playerCount: "Nombre de joueurs",
        undercoverCount: "Nombre d'Undercover",
        mrWhite: "Mr. White ?",
        startGame: "Commencer la partie"
    },

    // Home Screen
    home: {
        newGame: "Nouvelle Partie",
        rules: "Règles",
        settings: "Paramètres",
        wordLists: "Listes de Mots"
    },

    // Mode Selection
    modeSelection: {
        title: "Choisir un mode"
    },
    modes: {
        classic: "Classique",
        duo: "Duo",
        children: "Enfants",
        hardcore: "Hardcore"
    },

    // Duo Selection
    duoSelection: {
        title: "Mode Duo",
        subtitle: "Choisis ton style de duel",
        classicTitle: "Duo classique",
        classicDesc: "Mots proches",
        chaosTitle: "Duo chaos",
        chaosDesc: "Mots totalement différents"
    },


    // Settings Modal
    settings: {
        title: "Paramètres",
        wordLists: "📚 Listes de mots",
        parameters: "⚙️ Paramètres",
        save: "Enregistrer",
        rules: "📜 Règles",

        // Rules Tab
        rulesTab: {
            goalTitle: "But du jeu",
            goal: "Démasquer les imposteurs (Undercover et Mr. White) avant qu'ils ne vous éliminent !",
            rolesTitle: "Les Rôles",
            citizen: "Citoyen : Vous avez le même mot secret que les autres Citoyens.",
            undercover: "Undercover : Vous avez un mot légèrement différent.",
            mrWhite: "Mr. White : Vous n'avez aucun mot.",
            turnTitle: "Déroulement",
            turn: "Chacun son tour, donnez un indice (un seul mot) en rapport avec votre mot secret. Mr. White doit improviser en écoutant les autres.",
            voteTitle: "Vote & Élimination",
            vote: "Après le tour de table, discutez et votez pour éliminer celui qui vous semble suspect.",
            winTitle: "Conditions de victoire",
            winCitizen: "Citoyens : Éliminez tous les imposteurs.",
            winImpostor: "Imposteurs : Restez en vie jusqu'à être en majorité (ou à 2 joueurs restants).",
            winMrWhite: "Mr. White : Si vous êtes éliminé, vous avez une dernière chance en devinant le mot des Citoyens !",
            duoTitle: "Règles Duo",
            duoClassic: "Duo Classique : 1 Citoyen vs 1 Undercover. Les mots sont très proches.",
            duoChaos: "Duo Chaos : 2 mots totalement différents. Bluffez pour faire croire que vous avez le même mot !",
            hardcoreTitle: "Règles Hardcore",
            hardcoreDesc1: "Les mots sont des triplets (ex: Lion, Tigre, Léopard).",
            hardcoreDesc2: "S'il y a 2 Undercovers, ils peuvent avoir des mots différents !"
        },

        // Word Lists
        wordListsDescription: "Sélectionnez les catégories de mots à utiliser",

        // Global Settings
        globalSettings: "🌍 Paramètres globaux",
        uiLanguage: "Langue de l'interface",
        wordsLanguage: "Langue des mots",

        // Mr. White
        mrWhiteSection: "👤 Mr. White",
        mrWhitePlayer1: "Autoriser Mr. White en Joueur 1",

        // Vote Timer
        voteTimerSection: "⏱️ Temps pour vote",
        timer30: "30 secondes",
        timer45: "45 secondes",
        timer60: "60 secondes",
        timerUnlimited: "Illimité",

        // Role Reveal
        roleRevealSection: "👁️ Révéler les rôles",
        showRoles: "Afficher tous les rôles à la fin",

        // Game Mode
        gameModeSection: "🎮 Mode de jeu",
        quickMode: "Rapide (undercover gagnent en stricte supériorité)",
        longMode: "Long (jusqu'à 2 joueurs restants)",

        // First Player
        firstPlayerSection: "🎯 Choix du premier joueur",
        alwaysPlayer1: "Toujours Joueur 1",
        random: "Aléatoire",
        previousWinner: "Gagnant de la partie précédente",

        // Sound
        soundSection: "🔊 Son & vibrations",
        sound: "Sons",
        vibration: "Vibrations"
    },

    // Reveal Screen
    reveal: {
        passTo: "Passe le téléphone à",
        viewSecret: "Voir mon mot secret",
        confirmed: "C'est vu !",
        youAreMrWhite: "Vous êtes Mr. White",
        mrWhiteHint: "Vous n'avez pas de mot. Improvisez !",
        memorize: "Mémorisez votre mot secret."
    },

    // Game Screen
    game: {
        title: "Tour de table",
        instruction: "Chacun donne un indice.",
        undercoverRemaining: "Undercover restants :",
        mrWhitePresent: "Mr. White :",
        startVote: "Passer au vote"
    },

    // Vote Screen
    vote: {
        title: "Vote",
        instruction: "Qui est l'imposteur ?"
    },

    // Elimination Screen
    elimination: {
        eliminated: "est éliminé !",
        wasCitizen: "C'était un Citoyen.",
        wasUndercover: "C'était un Undercover !",
        wasMrWhite: "C'était Mr. White !",
        mrWhiteGuess: "Mr. White, tentez de deviner le mot des Citoyens !",
        guessPlaceholder: "Votre supposition...",
        validate: "Valider",
        wrongGuess: "Mauvaise réponse !",
        nextRound: "Tour suivant"
    },

    // Game Over Screen
    gameover: {
        victory: "Victoire !",
        citizensWin: "Victoire des Citoyens !",
        impostorsWin: "Victoire des Imposteurs !",
        mrWhiteWin: "Victoire de Mr. White !",
        allImpostorsEliminated: "Tous les imposteurs ont été éliminés.",
        impostorsMajority: "Ils sont majoritaires.",
        mrWhiteGuessed: "Il a trouvé le mot caché :",
        rolesTitle: "Rôles des joueurs",
        replay: "Rejouer"
    },

    // Roles
    roles: {
        CITIZEN: "Citoyen",
        UNDERCOVER: "Undercover",
        MR_WHITE: "Mr. White"
    },

    // Player
    player: "Joueur",

    // Languages
    languages: {
        fr: "Français",
        en: "English",
        es: "Español"
    }
};
