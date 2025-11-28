const translations_es = {
    // Setup Screen
    setup: {
        title: "Configuración",
        settings: "⚙️ Ajustes",
        playerCount: "Número de jugadores",
        undercoverCount: "Número de Undercover",
        mrWhite: "Mr. White?",
        startGame: "Empezar partida"
    },

    // Home Screen
    home: {
        newGame: "Nueva Partida",
        rules: "Reglas",
        settings: "Ajustes",
        wordLists: "Listas de Palabras"
    },

    // Mode Selection
    modeSelection: {
        title: "Elegir un modo"
    },
    modes: {
        classic: "Clásico",
        duo: "Dúo",
        children: "Niños",
        hardcore: "Hardcore"
    },

    // Duo Selection
    duoSelection: {
        title: "Modo Dúo",
        subtitle: "Elige tu estilo de duelo",
        classicTitle: "Dúo Clásico",
        classicDesc: "Palabras similares",
        chaosTitle: "Dúo Caos",
        chaosDesc: "Palabras totalmente diferentes"
    },

    // Settings Modal
    settings: {
        title: "Configuración",
        wordLists: "📚 Listas de Palabras",
        parameters: "⚙️ Parámetros",
        save: "Guardar",
        rules: "📜 Reglas",
        credits: "Créditos",

        // Rules Tab
        rulesTab: {
            goalTitle: "Objetivo",
            goal: "¡Desenmascara a los impostores (Undercover y Mr. White) antes de que te eliminen!",
            rolesTitle: "Roles",
            citizen: "Ciudadano: Tienes la misma palabra secreta que los otros Ciudadanos.",
            undercover: "Undercover: Tienes una palabra ligeramente diferente.",
            mrWhite: "Mr. White: No tienes ninguna palabra.",
            turnTitle: "Desarrollo",
            turn: "Por turnos, dad una pista (una sola palabra) relacionada con vuestra palabra secreta. Mr. White debe improvisar escuchando a los demás.",
            voteTitle: "Votación y Eliminación",
            vote: "Después de la ronda, discutid y votad para eliminar al jugador más sospechoso.",
            winTitle: "Condiciones de victoria",
            winCitizen: "Ciudadanos: Eliminad a todos los impostores.",
            winImpostor: "Impostores: Sobrevivid hasta ser mayoría (o quedar 2 jugadores).",
            winMrWhite: "Mr. White: ¡Si eres eliminado, tienes una última oportunidad adivinando la palabra de los Ciudadanos!",
            duoTitle: "Reglas Dúo",
            duoClassic: "Dúo Clásico: 1 Ciudadano vs 1 Undercover. Las palabras son muy similares.",
            duoChaos: "Dúo Caos: 2 palabras totalmente diferentes. ¡Farolea para que crean que tienes la misma palabra!",
            hardcoreTitle: "Reglas Hardcore",
            hardcoreDesc1: "Las palabras son tripletes (ej: León, Tigre, Leopardo).",
            hardcoreDesc2: "¡Si hay 2 Undercovers, pueden tener palabras diferentes!"
        },

        // Word Lists
        wordListsDescription: "Seleccione las categorías de palabras a usar",

        // Global Settings
        globalSettings: "🌍 Configuración Global",
        uiLanguage: "Idioma de la Interfaz",
        wordsLanguage: "Idioma de las Palabras",

        // Mr. White
        mrWhiteSection: "👤 Mr. White",
        mrWhitePlayer1: "Permitir Mr. White como Jugador 1",

        // Vote Timer
        voteTimerSection: "⏱️ Tiempo para Votar",
        timer30: "30 segundos",
        timer45: "45 segundos",
        timer60: "60 segundos",
        timerUnlimited: "Ilimitado",

        // Role Reveal
        roleRevealSection: "👁️ Revelar Roles",
        showRoles: "Mostrar todos los roles al final",

        // Game Mode
        gameModeSection: "🎮 Modo de Juego",
        quickMode: "Rápido (undercover ganan en estricta mayoría)",
        longMode: "Largo (hasta quedar 2 jugadores)",

        // First Player
        firstPlayerSection: "🎯 Elección del Primer Jugador",
        alwaysPlayer1: "Siempre Jugador 1",
        random: "Aleatorio",
        previousWinner: "Ganador de la partida anterior",

        // Sound
        soundSection: "🔊 Sonido y Vibración",
        sound: "Sonidos",
        vibration: "Vibración"
    },

    // Reveal Screen
    reveal: {
        passTo: "Pasa el teléfono a",
        viewSecret: "Ver mi palabra secreta",
        confirmed: "¡Entendido!",
        youAreMrWhite: "Eres Mr. White",
        mrWhiteHint: "No tienes palabra. ¡Improvisa!",
        memorize: "Memoriza tu palabra secreta."
    },

    // Game Screen
    game: {
        title: "Ronda de Mesa",
        instruction: "Cada uno da una pista.",
        undercoverRemaining: "Encubiertos restantes:",
        mrWhitePresent: "Mr. White:",
        startVote: "Comenzar Votación"
    },

    // Vote Screen
    vote: {
        title: "Votación",
        instruction: "¿Quién es el impostor?"
    },

    // Elimination Screen
    elimination: {
        eliminated: "¡está eliminado!",
        wasCitizen: "Era un Ciudadano.",
        wasUndercover: "¡Era un Encubierto!",
        wasMrWhite: "¡Era Mr. White!",
        mrWhiteGuess: "Mr. White, ¡intenta adivinar la palabra de los Ciudadanos!",
        guessPlaceholder: "Tu suposición...",
        validate: "Validar",
        wrongGuess: "¡Respuesta incorrecta!",
        nextRound: "Siguiente Ronda"
    },

    // Game Over Screen
    gameover: {
        victory: "¡Victoria!",
        citizensWin: "¡Victoria de los Ciudadanos!",
        impostorsWin: "¡Victoria de los Impostores!",
        mrWhiteWin: "¡Victoria de Mr. White!",
        allImpostorsEliminated: "Todos los impostores han sido eliminados.",
        impostorsMajority: "Son mayoría.",
        mrWhiteGuessed: "Encontró la palabra oculta:",
        rolesTitle: "Roles de los Jugadores",
        replay: "Jugar de Nuevo"
    },

    // Roles
    roles: {
        CITIZEN: "Ciudadano",
        UNDERCOVER: "Encubierto",
        MR_WHITE: "Mr. White"
    },

    // Player
    player: "Jugador",

    // Languages
    languages: {
        fr: "Français",
        en: "English",
        es: "Español"
    }
};
