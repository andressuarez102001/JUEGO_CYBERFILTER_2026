class CardGrid {
    static CARD_SELECTOR = '.agente-card';

    #element;
    #cards = null;
    #cardsByIndex = null;

    constructor(element) {
        this.#element = element;
    }

    fillWithDuplicates(targetCount, preferredAgentIds = []) {
        if (!this.#element || this.#cards) {
            return;
        }

        const originalCards = Array.from(
            this.#element.querySelectorAll(CardGrid.CARD_SELECTOR)
        );
        const target = Math.max(originalCards.length, Number(targetCount) || 0);
        if (!originalCards.length || originalCards.length >= target) {
            return;
        }

        const cardsByAgentId = new Map();
        originalCards.forEach(card => {
            const agentId = parseInt(card.getAttribute('data-index'), 10);
            card.setAttribute('data-agent-id', String(agentId));
            cardsByAgentId.set(agentId, card);
        });

        const orderedAgentIds = [
            ...new Set([...preferredAgentIds.map(Number), ...cardsByAgentId.keys()])
        ].filter(agentId => cardsByAgentId.has(agentId));

        let nextIndex = originalCards.length;
        let sourcePosition = 0;
        while (nextIndex < target) {
            const agentId = orderedAgentIds[sourcePosition % orderedAgentIds.length];
            const duplicate = cardsByAgentId.get(agentId).cloneNode(true);
            duplicate.setAttribute('data-index', String(nextIndex));
            duplicate.setAttribute('data-agent-id', String(agentId));
            duplicate.setAttribute('data-duplicate', 'true');
            this.#element.appendChild(duplicate);
            nextIndex += 1;
            sourcePosition += 1;
        }
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

    getAgentId(index) {
        const card = this.getCard(index);
        return card ? card.agentId : Number.NaN;
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

    markIncorrect(index) {
        const card = this.getCard(index);
        if (card) {
            card.markIncorrect();
        }
    }

    clearStates() {
        this.getCards().forEach(card => card.clearState());
    }
}
