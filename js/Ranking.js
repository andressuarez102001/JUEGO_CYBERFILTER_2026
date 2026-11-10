class Ranking {
    static PAGE_SIZE = 5;
    static ROW_SIZE = 4;

    constructor(options) {
        this.screens = options.screens;
        this.navigation = options.navigation;
        this.exitBtn = options.exitBtn;
        this.onExit = options.onExit || (() => {});
        this.resolveButton = options.resolveButton;
        this.leaderboard = options.leaderboard;
        this.currentPage = 0;
        this.cellCache = new Map();
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

    open(onExit) {
        if (typeof onExit === 'function') {
            this.onExit = onExit;
        }
        this.render();
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
        const target = Math.min(Math.max(0, page), Math.max(0, this.screens.length - 1));
        this.hidePage(this.currentPage);
        this.currentPage = target;
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

    getDataCells(screen) {
        if (!screen) {
            return [];
        }
        if (this.cellCache.has(screen)) {
            return this.cellCache.get(screen);
        }
        const headerClasses = ['p', 'n', 'pu', 'ni'];
        const cells = Array.from(screen.querySelectorAll('.rankin-box2 .box'))
            .filter(cell => !headerClasses.some(cls => cell.classList.contains(cls)));
        this.cellCache.set(screen, cells);
        return cells;
    }

    render() {
        if (!this.leaderboard) {
            return;
        }
        const entries = this.leaderboard.ranked();

        this.screens.forEach((screen, pageIndex) => {
            const cells = this.getDataCells(screen);
            const pageStart = pageIndex * Ranking.PAGE_SIZE;

            for (let row = 0; row < Ranking.PAGE_SIZE; row += 1) {
                const rowCells = cells.slice(
                    row * Ranking.ROW_SIZE,
                    row * Ranking.ROW_SIZE + Ranking.ROW_SIZE
                );
                if (rowCells.length === 0) {
                    continue;
                }

                const entry = entries[pageStart + row];
                if (entry) {
                    rowCells[0].textContent = String(pageStart + row + 1);
                    rowCells[1].textContent = entry.name;
                    rowCells[2].textContent = String(entry.points);
                    rowCells[3].textContent = String(entry.maxLevel);
                } else {
                    rowCells.forEach((cell, index) => {
                        const isEmpty = pageIndex === 0 && row === 0 && index === 1;
                        cell.textContent = isEmpty ? 'SIN REGISTROS AÚN' : '';
                    });
                }
            }
        });
    }
}
