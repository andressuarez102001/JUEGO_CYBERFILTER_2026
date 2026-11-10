class CardGrid {
    static CARD_SELECTOR = '.agente-card';

    constructor(element) {
        this.element = element;
    }

    onClick(handler) {
        if (this.element) {
            this.element.addEventListener('click', handler);
        }
    }

    getCards() {
        if (!this.element) {
            return [];
        }
        return Array.from(this.element.querySelectorAll(CardGrid.CARD_SELECTOR));
    }

    getCard(index) {
        return this.getCards().find(
            card => parseInt(card.getAttribute('data-index'), 10) === index
        ) || null;
    }

    toggleSelection(index) {
        const card = this.getCard(index);
        if (!card) {
            return false;
        }
        const wasSelected = card.classList.contains('selected');
        card.classList.toggle('selected');
        return !wasSelected;
    }

    markCorrect(indices) {
        indices.forEach(index => {
            const card = this.getCard(index);
            if (card) {
                card.classList.add('correct');
            }
        });
    }

    markSelectedAsWrong() {
        this.getCards().forEach(card => {
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                card.classList.add('incorrect');
            }
        });
    }

    clearStates() {
        this.getCards().forEach(card => {
            card.classList.remove('selected', 'correct', 'incorrect');
        });
    }
}
