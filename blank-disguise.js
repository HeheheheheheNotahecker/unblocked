class BlankDisguise {
    constructor() {
        this.activated = false;
        this.secretCode = [];
        this.requiredCode = ['Space', 'Space', 'Space', 'Enter'];
        this.init();
    }

    init() {
        // Make the page look exactly like about:blank
        document.title = "about:blank";
        document.body.style.backgroundColor = "white";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        
        // Remove any favicon
        this.removeFavicon();
        
        // Add secret key combination to activate
        this.setupActivationListener();
        
        // Prevent right-click inspection
        this.preventInspection();
        
        // Disable text selection
        this.disableSelection();
        
        // Hide from common detection methods
        this.antiDetection();
    }

    removeFavicon() {
        const links = document.querySelectorAll("link[rel*='icon']");
        links.forEach(link => link.remove());
        
        // Prevent new favicon requests
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = 'data:image/x-icon;base64,';
        document.head.appendChild(newLink);
    }

    setupActivationListener() {
        document.addEventListener('keydown', (e) => {
            this.secretCode.push(e.code);
            
            // Keep only the last requiredCode.length items
            if (this.secretCode.length > this.requiredCode.length) {
                this.secretCode.shift();
            }
            
            // Check if code matches
            if (this.checkSecretCode()) {
                this.activateSearchEngine();
            }
            
            // Alternative activation: Triple click
            if (e.code === 'Space' && e.ctrlKey && e.shiftKey) {
                this.activateSearchEngine();
            }
        });
        
        // Mouse-based activation (triple click)
        let clickCount = 0;
        let clickTimer;
        
        document.addEventListener('click', () => {
            clickCount++;
            
            if (clickCount === 3) {
                this.activateSearchEngine();
                clickCount = 0;
                clearTimeout(clickTimer);
            } else {
                clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 500);
            }
        });
    }

    checkSecretCode() {
        if (this.secretCode.length !== this.requiredCode.length) return false;
        
        for (let i = 0; i < this.requiredCode.length; i++) {
            if (this.secretCode[i] !== this.requiredCode[i]) {
                return false;
            }
        }
        return true;
    }

    activateSearchEngine() {
        if (this.activated) return;
        this.activated = true;
        
        // Hide blank screen
        const blankScreen = document.getElementById('blankScreen');
        if (blankScreen) {
            blankScreen.style.display = 'none';
        }
        
        // Show search engine
        const searchEngine = document.getElementById('searchEngine');
        if (searchEngine) {
            searchEngine.style.display = 'block';
            
            // Load the search engine interface
            const frame = document.getElementById('browserFrame');
            frame.src = 'search-engine.html';
            
            // Show search interface
            const searchInterface = document.getElementById('searchInterface');
            searchInterface.classList.remove('hidden');
        } else {
            // Fallback: redirect to search engine
            window.location.href = 'search-engine.html';
        }
        
        // Clear secret code
        this.secretCode = [];
    }

    preventInspection() {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                return false;
            }
        });
        
        // Disable right-click context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }

    disableSelection() {
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });
        
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.mozUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
    }

    antiDetection() {
        // Remove common detection markers
        delete window.console;
        window.console = {
            log: () => {},
            warn: () => {},
            error: () => {},
            info: () => {}
        };
        
        // Spoof user agent if possible
        Object.defineProperty(navigator, 'userAgent', {
            get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });
        
        // Hide from extension detection
        if (window.chrome && chrome.runtime) {
            Object.defineProperty(chrome.runtime, 'id', {
                get: () => undefined
            });
        }
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    window.blankDisguise = new BlankDisguise();
});

// Additional stealth measures
document.addEventListener('DOMContentLoaded', () => {
    // Remove any scripts that might detect our page
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
        if (script.src && (
            script.src.includes('goguardian') || 
            script.src.includes('securly') ||
            script.src.includes('lightspeed'))) {
            script.remove();
        }
    }
});
