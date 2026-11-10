class Ranking {
    constructor(options) {
        this.screens = options.screens;
        this.navigation = options.navigation;
        this.exitBtn = options.exitBtn;
        this.onExit = options.onExit;
        this.resolveButton = options.resolveButton;
        this.currentPage = 0;
    }

    bindEvents() {
        this.navigation.forEach((targetPage, btnId) => {
            const btn = this.resolveButton(btnId);
            if (btn) {
                btn.addEventListener('click', () => this.goToPage(targetPage));
            }
        });
        if (this.exitBtn) {
            this.exitBtn.addEventListener('click', () => this.exit());
        }
    }

    open() {
        this.goToPage(0);
    }

    exit() {
        this.close();
        this.onExit();
    }

    close() {
        this.hidePage(this.currentPage);
    }

    goToPage(page) {
        this.hidePage(this.currentPage);
        this.currentPage = page;
        this.showPage(this.currentPage);
    }

    hidePage(page) {
        const screen = this.screens[page];
        if (screen) {
            screen.classList.add('hidden');
        }
    }

    showPage(page) {
        const screen = this.screens[page];
        if (screen) {
            screen.classList.remove('hidden');
        }
    }
}
