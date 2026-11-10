class Level {
    static POINTS_ON_SUCCESS = 100;
    static FAIL_RETRY_DELAY = 3000;

    constructor(config, views, deps) {
        this.correctAgents = config.correctAgents;
        this.resetsScoreOnReset = Boolean(config.resetsScoreOnReset);
        this.showWrongSelectionsOnFail = Boolean(config.showWrongSelectionsOnFail);

        this.views = views;
        this.deps = deps;
        this.selection = [];

        this.bindEvents();
    }

    bindEvents() {
        this.views.cards.onClick(event => this.onGridClick(event));
        if (this.views.verifyBtn) {
            this.views.verifyBtn.addEventListener('click', () => this.verify());
        }
    }

    isLocked() {
        return this.views.verifyBtn ? this.views.verifyBtn.disabled : false;
    }

    isCorrectIndex(index) {
        return this.correctAgents.includes(index);
    }

    onGridClick(event) {
        const card = event.target.closest('.agente-card');
        if (!card || this.isLocked()) {
            return;
        }
        this.toggleCard(parseInt(card.getAttribute('data-index'), 10));
    }

    toggleCard(index) {
        const isSelected = this.views.cards.toggleSelection(index);
        if (isSelected) {
            this.selection.push(index);
        } else {
            this.selection = this.selection.filter(selected => selected !== index);
        }
    }

    isMissionSuccessful() {
        const correctSet = new Set(this.correctAgents);
        const selectedSet = new Set(this.selection);
        return (
            this.selection.length === this.correctAgents.length &&
            this.selection.every(index => correctSet.has(index)) &&
            this.correctAgents.every(index => selectedSet.has(index))
        );
    }

    verify() {
        this.hideResults();
        if (this.isMissionSuccessful()) {
            this.onSuccess();
        } else {
            this.onFail();
        }
    }

    onSuccess() {
        this.showResult(this.views.resultOk);
        this.revealNextBtn();
        this.lock();
        this.views.cards.markCorrect(this.correctAgents);
        this.deps.score.add(Level.POINTS_ON_SUCCESS);
    }

    onFail() {
        this.showResult(this.views.resultFail);
        this.lock();
        if (this.showWrongSelectionsOnFail) {
            this.views.cards.markSelectedAsWrong();
        }
        setTimeout(() => this.reset(), Level.FAIL_RETRY_DELAY);
    }

    showResult(element) {
        if (element) {
            element.classList.remove('hidden');
        }
    }

    hideResults() {
        [this.views.resultOk, this.views.resultFail].forEach(element => {
            if (element) {
                element.classList.add('hidden');
            }
        });
    }

    revealNextBtn() {
        if (this.views.nextBtn) {
            this.views.nextBtn.classList.remove('hidden');
        }
    }

    hideNextBtn() {
        if (this.views.nextBtn) {
            this.views.nextBtn.classList.add('hidden');
        }
    }

    lock() {
        if (this.views.verifyBtn) {
            this.views.verifyBtn.disabled = true;
        }
    }

    unlock() {
        if (this.views.verifyBtn) {
            this.views.verifyBtn.disabled = false;
        }
    }

    enter() {
        this.reset();
    }

    reset() {
        this.selection = [];
        this.views.cards.clearStates();
        this.hideResults();
        this.hideNextBtn();
        this.unlock();
        if (this.resetsScoreOnReset) {
            this.deps.score.reset();
        }
    }
}
