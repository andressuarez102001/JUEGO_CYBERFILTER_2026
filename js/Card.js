class Card {
    static SELECTED_CLASS = 'selected';
    static CORRECT_CLASS = 'correct';
    static INCORRECT_CLASS = 'incorrect';

    #element;
    #index;

    constructor(element) {
        this.#element = element;
        this.#index = parseInt(element.getAttribute('data-index'), 10);
    }

    get element() {
        return this.#element;
    }

    get index() {
        return this.#index;
    }

    get isSelected() {
        return this.#element.classList.contains(Card.SELECTED_CLASS);
    }

    toggle() {
        const wasSelected = this.isSelected;
        this.#element.classList.toggle(Card.SELECTED_CLASS);
        return !wasSelected;
    }

    markCorrect() {
        this.#element.classList.add(Card.CORRECT_CLASS);
    }

    markIncorrect() {
        this.#element.classList.remove(Card.SELECTED_CLASS);
        this.#element.classList.add(Card.INCORRECT_CLASS);
    }

    clearState() {
        this.#element.classList.remove(
            Card.SELECTED_CLASS,
            Card.CORRECT_CLASS,
            Card.INCORRECT_CLASS
        );
    }
}
