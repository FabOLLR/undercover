// Export all word lists with metadata
window.wordLists = {
    // --- CLASSIC / DUO LISTS ---
    classique: {
        id: 'classique',
        name: 'Classique',
        icon: '🎯',
        description: 'Mots généraux et variés',
        words: window.classiqueWords,
        mode: 'classic', // Available in Classic and Duo
        type: 'pair',
        enabled: true
    },
    films: {
        id: 'films',
        name: 'Films & Cinéma',
        icon: '🎬',
        description: 'Univers du cinéma',
        words: window.filmsWords,
        mode: 'classic',
        type: 'pair',
        enabled: true
    },
    cuisine: {
        id: 'cuisine',
        name: 'Cuisine',
        icon: '🍳',
        description: 'Gastronomie et cuisine',
        words: window.cuisineWords,
        mode: 'classic',
        type: 'pair',
        enabled: true
    },
    sports: {
        id: 'sports',
        name: 'Sports',
        icon: '⚽',
        description: 'Monde du sport',
        words: window.sportsWords,
        mode: 'classic',
        type: 'pair',
        enabled: true
    },
    culture: {
        id: 'culture',
        name: 'Culture',
        icon: '🎨',
        description: 'Art, musique et littérature',
        words: window.cultureWords,
        mode: 'classic',
        type: 'pair',
        enabled: true
    },
    jeux: {
        id: 'jeux',
        name: 'Jeux',
        icon: '🎮',
        description: 'Jeux vidéo et jeux de société',
        words: window.jeuxWords,
        mode: 'classic',
        type: 'pair',
        enabled: true
    },
    manga: {
        id: 'manga',
        name: 'Mangas & Animés',
        icon: '🎌',
        description: 'Univers des mangas et animés',
        words: window.mangaWords,
        mode: 'classic',
        type: 'pair',
        enabled: true
    },
    musique: {
        id: 'musique',
        name: 'Musique',
        icon: '🎵',
        description: 'Artistes et genres musicaux',
        words: window.musiqueWords,
        mode: 'classic',
        type: 'pair',
        enabled: true
    },
    influenceurs: {
        id: 'influenceurs',
        name: 'Influenceurs',
        icon: '📱',
        description: 'Youtubers et streamers',
        words: window.influenceursWords,
        mode: 'classic',
        type: 'pair',
        enabled: true
    },
    hard: {
        id: 'hard',
        name: 'Hard / Adulte',
        icon: '🔞',
        description: 'Thèmes matures et tabous',
        words: window.hardWords,
        mode: 'classic',
        type: 'pair',
        enabled: true
    },

    // --- CHILDREN LISTS ---
    enfants_animaux: {
        id: 'enfants_animaux',
        name: 'Animaux (Enfants)',
        icon: '🐱',
        description: 'Animaux simples pour les enfants',
        words: window.enfantsAnimauxWords,
        mode: 'children',
        type: 'pair',
        enabled: true
    },
    enfants_objets: {
        id: 'enfants_objets',
        name: 'Objets (Enfants)',
        icon: '🧸',
        description: 'Objets du quotidien',
        words: window.enfantsObjetsWords,
        mode: 'children',
        type: 'pair',
        enabled: true
    },
    enfants_aliments: {
        id: 'enfants_aliments',
        name: 'Aliments (Enfants)',
        icon: '🍎',
        description: 'Nourriture et gourmandises',
        words: window.enfantsAlimentsWords,
        mode: 'children',
        type: 'pair',
        enabled: true
    },

    // --- HARDCORE LISTS ---
    hardcore_animaux: {
        id: 'hardcore_animaux',
        name: 'Animaux (Hardcore)',
        icon: '🐅',
        description: 'Triplets d\'animaux très proches',
        words: window.hardcoreAnimauxWords,
        mode: 'hardcore',
        type: 'triplet',
        enabled: true
    },
    hardcore_objets: {
        id: 'hardcore_objets',
        name: 'Objets (Hardcore)',
        icon: '🎻',
        description: 'Triplets d\'objets similaires',
        words: window.hardcoreObjetsWords,
        mode: 'hardcore',
        type: 'triplet',
        enabled: true
    }
};
