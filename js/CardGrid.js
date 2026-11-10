class CardGrid {
    static CARD_SELECTOR = '.agente-card';

    #element;
    #cards = null;
    #cardsByIndex = null;

    constructor(element) {
        this.#element = element;
    }

    onClick(handler) {
        if (this.#element) {
            this.#element.addEventListener('click', handler);
        }
    }

    loadCards() {
        if (this.#cards) {
            return;
        }
        const elements = this.#element
            ? Array.from(this.#element.querySelectorAll(CardGrid.CARD_SELECTOR))
            : [];
        this.#cards = elements
            .map(element => new Card(element))
            .filter(card => !Number.isNaN(card.index));
        this.#cardsByIndex = new Map(this.#cards.map(card => [card.index, card]));
    }

    getCards() {
        this.loadCards();
        return this.#cards;
    }

    getCard(index) {
        this.loadCards();
        return this.#cardsByIndex.get(index) || null;
    }

    toggleSelection(index) {
        const card = this.getCard(index);
        if (!card) {
            return false;
        }
        return card.toggle();
    }

    markCorrect(indices) {
        indices.forEach(index => {
            const card = this.getCard(index);
            if (card) {
                card.markCorrect();
            }
        });
    }

    markSelectedAsWrong() {
        this.getCards().forEach(card => {
            if (card.isSelected) {
                card.markIncorrect();
            }
        });
    }

    clearStates() {
        this.getCards().forEach(card => card.clearState());
    }
}
