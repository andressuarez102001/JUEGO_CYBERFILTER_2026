class Chat {
    constructor(options) {
        this.input = options.input;
        this.messages = options.messages;
        this.sendBtn = options.sendBtn;
        this.getUsername = options.getUsername;
    }

    bindEvents() {
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.send());
        }
        if (this.input) {
            this.input.addEventListener('keypress', event => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.send();
                }
            });
        }
    }

    send() {
        if (!this.input || !this.messages) {
            return;
        }
        const text = this.input.value.trim();
        if (text === '') {
            return;
        }
        const username = this.getUsername() || 'Agente Desconocido';

        const message = document.createElement('div');
        message.classList.add('chat-message');

        const author = document.createElement('strong');
        author.textContent = `${username}: `;

        message.appendChild(author);
        message.appendChild(document.createTextNode(text));

        this.messages.appendChild(message);
        this.input.value = '';
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}
