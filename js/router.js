export class Router {
    constructor() {
        this.app = document.getElementById('app');
        this.routes = {
            'home': 'html/accueil.html',
            'mode-selection': 'html/select-mode.html',
            'mode-classic': 'html/mode-classic.html',
            'mode-duo': 'html/mode-duo.html',
            'mode-children': 'html/mode-enfants.html',
            'mode-hardcore': 'html/mode-hardcore.html',
            'reveal': 'html/reveal.html',
            'game': 'html/game.html',
            'vote': 'html/vote.html',
            'elimination': 'html/elimination.html',
            'gameover': 'html/gameover.html'
        };
        this.currentView = null;
    }

    async load(route) {
        const url = this.routes[route];
        if (!url) {
            console.error('Route not found:', route);
            return;
        }

        try {
            const response = await fetch(url + '?v=' + Date.now());
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            const html = await response.text();
            this.app.innerHTML = html;
            this.currentView = route;

            // Dispatch event for other modules
            const event = new CustomEvent('view-loaded', { detail: { view: route } });
            document.dispatchEvent(event);

        } catch (error) {
            console.error('Error loading view:', error);
            this.app.innerHTML = '<p>Erreur de chargement.</p>';
        }
    }

    async init() {
        // Load modals first
        try {
            const response = await fetch('html/modals.html');
            const html = await response.text();
            document.body.insertAdjacentHTML('beforeend', html);
        } catch (error) {
            console.error('Error loading modals:', error);
        }

        this.load('home');
    }
}
