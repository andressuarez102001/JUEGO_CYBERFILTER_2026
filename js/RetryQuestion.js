class RetryQuestion {
    constructor(documentRef) {
        this.document = documentRef;
        this.modal = this.document.getElementById('retry-question-modal');
        this.levelLabel = this.document.getElementById('retry-question-level');
        this.question = this.document.getElementById('retry-question-text');
        this.options = this.document.getElementById('retry-question-options');
    }

    open(levelNumber, data, onCorrect, onIncorrect) {
        if (!this.modal || !this.question || !this.options) {
            onIncorrect();
            return;
        }

        this.levelLabel.textContent = `VALIDACIÓN DE RECUPERACIÓN · NIVEL ${levelNumber}`;
        this.question.textContent = data.question;
        this.options.replaceChildren();

        data.options.forEach((option, index) => {
            const button = this.document.createElement('button');
            button.type = 'button';
            button.className = 'retry-option';
            button.textContent = option;
            button.addEventListener('click', () => {
                this.close();
                if (index === data.correctOption) {
                    onCorrect();
                } else {
                    onIncorrect();
                }
            }, { once: true });
            this.options.appendChild(button);
        });

        this.modal.classList.remove('hidden');
    }

    close() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }
}
