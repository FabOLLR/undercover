// Translations registry
const translations = {
    fr: translations_fr,
    en: translations_en,
    es: translations_es
};

// Current language
let currentLanguage = 'fr';

// Get translation function
window.t = function (path) {
    const keys = path.split('.');
    let value = translations[currentLanguage];

    for (const key of keys) {
        if (value && typeof value === 'object') {
            value = value[key];
        } else {
            return path; // Return path if translation not found
        }
    }

    return value || path;
}

// Set language function
window.setLanguage = function (lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        updateUI();
    }
}

// Update all UI text elements
function updateUI() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);

        if (element.tagName === 'INPUT' && element.type === 'text') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });

    // Update document title
    document.title = t('setup.title');
}
