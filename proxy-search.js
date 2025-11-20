class ProxySearchEngine {
    constructor() {
        this.proxyServices = [
            "https://corrosion.pro/",
            "https://womginx.github.io/",
            "https://www.ultraviolet-node.com/",
            "https://hypertabs.undercase.workers.dev/",
            "https://interstellar.ink/",
            "https://nebula.varunbox.com/"
        ];
        
        this.currentProxy = this.proxyServices[0];
        this.searchEngines = {
            'Google': 'https://www.google.com/search?q=',
            'Bing': 'https://www.bing.com/search?q=',
            'DuckDuckGo': 'https://duckduckgo.com/?q=',
            'Youtube': 'https://www.youtube.com/results?search_query='
        };
    }

    search(query, engine = 'Google') {
        if (!query.trim()) return;
        
        const searchUrl = this.searchEngines[engine] + encodeURIComponent(query);
        return this.currentProxy + searchUrl;
    }

    navigateToUrl(url) {
        if (!url) return;
        
        // Add protocol if missing
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        
        return this.currentProxy + url;
    }

    setProxy(proxyUrl) {
        if (this.proxyServices.includes(proxyUrl)) {
            this.currentProxy = proxyUrl;
            return true;
        }
        return false;
    }

    getRandomProxy() {
        return this.proxyServices[Math.floor(Math.random() * this.proxyServices.length)];
    }

    rotateProxy() {
        this.currentProxy = this.getRandomProxy();
        return this.currentProxy;
    }

    // Quick access methods for common sites
    quickAccess(site) {
        const sites = {
            'google': 'https://www.google.com',
            'youtube': 'https://www.youtube.com',
            'netflix': 'https://www.netflix.com',
            'spotify': 'https://www.spotify.com',
            'discord': 'https://discord.com',
            'reddit': 'https://www.reddit.com',
            'twitter': 'https://twitter.com',
            'instagram': 'https://www.instagram.com'
        };
        
        return sites[site.toLowerCase()] ? this.currentProxy + sites[site.toLowerCase()] : null;
    }

    // Test proxy connectivity
    async testProxy(proxyUrl) {
        try {
            const testUrl = proxyUrl + 'https://www.google.com/gen_204';
            const response = await fetch(testUrl, { mode: 'no-cors' });
            return true;
        } catch (error) {
            return false;
        }
    }

    // Find working proxy
    async findWorkingProxy() {
        for (let proxy of this.proxyServices) {
            if (await this.testProxy(proxy)) {
                this.currentProxy = proxy;
                return proxy;
            }
        }
        return this.currentProxy; // Fallback to current
    }
}

// Global instance
window.proxyEngine = new ProxySearchEngine();

// Utility functions for the search interface
function performSearch() {
    const query = document.getElementById('mainSearch')?.value || document.getElementById('searchInput')?.value;
    if (!query) return;
    
    const searchUrl = window.proxyEngine.search(query);
    if (searchUrl) {
        loadUrl(searchUrl);
    }
}

function loadUrl(url) {
    // Implementation depends on the context
    const frame = document.getElementById('browserFrame') || document.getElementById('siteFrame');
    if (frame) {
        frame.src = url;
    } else {
        window.location.href = url;
    }
}

function loadProxySite(site) {
    const url = window.proxyEngine.quickAccess(site);
    if (url) {
        loadUrl(url);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+L to focus search/url bar
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        const searchInput = document.getElementById('mainSearch') || document.getElementById('searchInput') || document.getElementById('urlBar');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Escape to hide search interface
    if (e.key === 'Escape') {
        const searchInterface = document.getElementById('searchInterface');
        if (searchInterface && !searchInterface.classList.contains('hidden')) {
            searchInterface.classList.add('hidden');
        }
    }
    
    // Ctrl+R to rotate proxy
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        const newProxy = window.proxyEngine.rotateProxy();
        alert('Proxy rotated to: ' + newProxy);
    }
});
