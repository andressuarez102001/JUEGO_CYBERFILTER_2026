class StrictLevel extends Level {
    static PENALTY_DELAY = 1500;

    selectIndex(index, card) {
        const isSelecting = !card.classList.contains('selected');
        if (isSelecting && !this.isCorrectIndex(index)) {
            this.penalize();
            return;
        }
        this.toggleCard(index);
    }

    onTimeout() {
        this.showResult(this.views.resultFail, '¡TIEMPO AGOTADO!');
        this.penalize();
    }

    onFail() {
        this.penalize();
    }

    penalize() {
        this.stopTimer();
        this.showResult(this.views.resultFail);
        this.lock();
        this.restartId = setTimeout(() => {
            this.hideResults();
            this.deps.returnToLobby();
        }, StrictLevel.PENALTY_DELAY);
    }
}
