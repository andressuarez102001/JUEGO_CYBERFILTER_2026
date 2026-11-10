class StrictLevel extends Level {
    static PENALTY_DELAY = 1500;

    onGridClick(event) {
        const card = event.target.closest('.agente-card');
        if (!card || this.isLocked()) {
            return;
        }
        const index = parseInt(card.getAttribute('data-index'), 10);
        const isSelecting = !card.classList.contains('selected');
        if (isSelecting && !this.isCorrectIndex(index)) {
            this.penalize();
            return;
        }
        this.toggleCard(index);
    }

    onFail() {
        this.penalize();
    }

    penalize() {
        this.showResult(this.views.resultFail);
        this.lock();
        setTimeout(() => {
            this.hideResults();
            this.deps.returnToLobby();
        }, StrictLevel.PENALTY_DELAY);
    }
}
