class Level {
    static POINTS_PER_CARD = 100;
    static SUCCESS_BONUS = 200;
    constructor(config, views, deps) {
        const dependencies = deps || {};
        this.config = config;
        this.correctAgents = config.correctAgents;
        this.resetsScoreOnReset = Boolean(config.resetsScoreOnReset);
        this.showWrongSelectionsOnFail = Boolean(config.showWrongSelectionsOnFail);

        this.views = views;
        this.deps = dependencies;
        this.selection = [];
        this.restartId = null;
        this.timer = dependencies.timer || new LevelTimer(
            views.timer,
            config.timeLimit,
            () => this.onTimeout()
        );

        this.resultOkText = views.resultOk ? views.resultOk.textContent : '';
        this.resultFailText = views.resultFail ? views.resultFail.textContent : '';

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
        return this.correctAgents.includes(this.views.cards.getAgentId(index));
    }

    onGridClick(event) {
        const card = event.target.closest('.agente-card');
        if (!card || this.isLocked()) {
            return;
        }
        this.selectIndex(parseInt(card.getAttribute('data-index'), 10), card);
    }

    selectIndex(index, card) {
        const isSelecting = !card.classList.contains('selected');
        if (isSelecting && !this.isCorrectIndex(index)) {
            this.views.cards.markIncorrect(index);
            this.requestRetryQuestion('¡SELECCIÓN INCORRECTA!');
            return;
        }
        this.toggleCard(index);
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
        const selectedAgentIds = this.selection.map(index => this.views.cards.getAgentId(index));
        const selectedSet = new Set(selectedAgentIds);
        return (
            this.selection.length === this.correctAgents.length &&
            selectedAgentIds.every(agentId => correctSet.has(agentId)) &&
            selectedSet.size === selectedAgentIds.length &&
            this.correctAgents.every(index => selectedSet.has(index))
        );
    }

    verify() {
        this.hideResults();
        if (this.isMissionSuccessful()) {
            this.onSuccess();
        } else {
            this.requestRetryQuestion('LA SELECCIÓN NO COMPLETA LA MISIÓN.');
        }
    }

    onSuccess() {
        this.stopTimer();
        this.showResult(this.views.resultOk);
        this.revealNextBtn();
        this.lock();
        this.views.cards.markCorrect(this.selection);

        const points = this.correctAgents.length * Level.POINTS_PER_CARD + Level.SUCCESS_BONUS;
        this.deps.score.add(points);

        if (this.deps.onLevelComplete) {
            this.deps.onLevelComplete(this.config.number, this.deps.score.value);
        }
    }

    onFail(message) {
        this.stopTimer();
        this.showResult(this.views.resultFail, message);
        this.lock();
        this.views.cards.markSelectedAsWrong();
        this.deps.returnToLobby();
    }

    requestRetryQuestion(message) {
        this.stopTimer();
        this.showResult(this.views.resultFail, message);
        this.lock();
        this.views.cards.markSelectedAsWrong();

        if (typeof this.deps.showRetryQuestion === 'function') {
            this.deps.showRetryQuestion(this, this.config.retryQuestion);
            return;
        }
        this.deps.returnToLobby();
    }

    onTimeout() {
        this.onFail('¡TIEMPO AGOTADO!');
    }

    showResult(element, message) {
        if (!element) {
            return;
        }
        if (message) {
            element.textContent = message;
        }
        element.classList.remove('hidden');
    }

    hideResults() {
        [this.views.resultOk, this.views.resultFail].forEach(element => {
            if (element) {
                element.classList.add('hidden');
            }
        });
    }

    restoreResultTexts() {
        if (this.views.resultOk) {
            this.views.resultOk.textContent = this.resultOkText;
        }
        if (this.views.resultFail) {
            this.views.resultFail.textContent = this.resultFailText;
        }
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
        this.stopTimer();
        if (this.views.verifyBtn) {
            this.views.verifyBtn.disabled = true;
        }
    }

    unlock() {
        if (this.views.verifyBtn) {
            this.views.verifyBtn.disabled = false;
        }
    }

    startTimer() {
        this.timer.start();
    }

    stopTimer() {
        this.timer.stop();
    }

    clearPendingRestart() {
        if (this.restartId) {
            clearTimeout(this.restartId);
            this.restartId = null;
        }
    }

    leave() {
        this.stopTimer();
        this.clearPendingRestart();
    }

    enter() {
        this.restart();
    }

    restart() {
        this.reset();
        this.startTimer();
    }

    reset() {
        this.clearPendingRestart();
        this.selection = [];
        this.views.cards.clearStates();
        this.hideResults();
        this.restoreResultTexts();
        this.hideNextBtn();
        this.unlock();
        if (this.resetsScoreOnReset) {
            this.deps.score.reset();
        }
        this.timer.reset();
    }
}
