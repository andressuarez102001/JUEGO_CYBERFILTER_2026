class GamepadController {
    static AXIS_THRESHOLD = 0.55;
    static INITIAL_REPEAT_DELAY = 260;
    static REPEAT_DELAY = 130;

    constructor(documentRef, options = {}) {
        this.document = documentRef || document;
        this.onBack = typeof options.onBack === 'function' ? options.onBack : () => {};
        this.getActiveScreen = typeof options.getActiveScreen === 'function'
            ? options.getActiveScreen
            : () => this.document.body;
        this.status = this.document.getElementById('gamepad-status');
        this.activeGamepadIndex = null;
        this.focusedElement = null;
        this.previousButtons = [];
        this.previousDirection = null;
        this.nextMoveAt = 0;
        this.statusTimeout = null;
    }

    init() {
        if (!navigator.getGamepads) {
            return;
        }

        window.addEventListener('gamepadconnected', event => {
            this.activeGamepadIndex = event.gamepad.index;
            // El primer botón que activa la detección no debe ejecutar una
            // acción accidentalmente; se espera a que el jugador lo suelte
            // y vuelva a pulsarlo.
            this.previousButtons = [
                Boolean(event.gamepad.buttons[0] && event.gamepad.buttons[0].pressed),
                Boolean(event.gamepad.buttons[1] && event.gamepad.buttons[1].pressed)
            ];
            this.announce('MANDO CONECTADO · JOYSTICK PARA NAVEGAR · A PARA ELEGIR');
            this.focusFirstElement();
        });

        window.addEventListener('gamepaddisconnected', event => {
            if (event.gamepad.index === this.activeGamepadIndex) {
                this.activeGamepadIndex = null;
                this.previousButtons = [];
                this.clearFocus();
                this.announce('MANDO DESCONECTADO · EL MOUSE SIGUE DISPONIBLE');
            }
        });

        requestAnimationFrame(timestamp => this.update(timestamp));
    }

    update(timestamp) {
        const gamepad = this.getActiveGamepad();
        if (gamepad) {
            this.processButtons(gamepad);
            this.processDirection(gamepad, timestamp);
        }
        requestAnimationFrame(nextTimestamp => this.update(nextTimestamp));
    }

    getActiveGamepad() {
        const gamepads = navigator.getGamepads();
        if (this.activeGamepadIndex !== null && gamepads[this.activeGamepadIndex]) {
            return gamepads[this.activeGamepadIndex];
        }

        const available = Array.from(gamepads).find(gamepad => gamepad);
        if (!available) {
            return null;
        }

        this.activeGamepadIndex = available.index;
        return available;
    }

    processButtons(gamepad) {
        const buttons = gamepad.buttons || [];
        const confirmPressed = Boolean(buttons[0] && buttons[0].pressed);
        const backPressed = Boolean(buttons[1] && buttons[1].pressed);

        if (confirmPressed && !this.previousButtons[0]) {
            this.activateFocusedElement();
        }
        if (backPressed && !this.previousButtons[1]) {
            this.clearFocus();
            this.onBack();
        }
        this.previousButtons[0] = confirmPressed;
        this.previousButtons[1] = backPressed;
    }

    processDirection(gamepad, timestamp) {
        const direction = this.readDirection(gamepad);
        if (!direction) {
            this.previousDirection = null;
            return;
        }

        if (direction !== this.previousDirection) {
            this.move(direction);
            this.previousDirection = direction;
            this.nextMoveAt = timestamp + GamepadController.INITIAL_REPEAT_DELAY;
            return;
        }

        if (timestamp >= this.nextMoveAt) {
            this.move(direction);
            this.nextMoveAt = timestamp + GamepadController.REPEAT_DELAY;
        }
    }

    readDirection(gamepad) {
        const buttons = gamepad.buttons || [];
        if (buttons[12] && buttons[12].pressed) return 'up';
        if (buttons[13] && buttons[13].pressed) return 'down';
        if (buttons[14] && buttons[14].pressed) return 'left';
        if (buttons[15] && buttons[15].pressed) return 'right';

        const x = gamepad.axes && gamepad.axes[0] || 0;
        const y = gamepad.axes && gamepad.axes[1] || 0;
        if (Math.max(Math.abs(x), Math.abs(y)) < GamepadController.AXIS_THRESHOLD) {
            return null;
        }
        if (Math.abs(x) > Math.abs(y)) {
            return x < 0 ? 'left' : 'right';
        }
        return y < 0 ? 'up' : 'down';
    }

    getFocusableElements() {
        const retryModal = this.document.getElementById('retry-question-modal');
        const root = retryModal && !retryModal.classList.contains('hidden')
            ? retryModal
            : this.getActiveScreen();
        if (!root) {
            return [];
        }
        return Array.from(root.querySelectorAll('button:not([disabled]), .agente-card'))
            .filter(element => element.getClientRects().length > 0);
    }

    focusFirstElement() {
        const candidates = this.getFocusableElements();
        if (candidates.length) {
            this.setFocus(candidates[0]);
        }
    }

    move(direction) {
        const candidates = this.getFocusableElements();
        if (!candidates.length) {
            this.clearFocus();
            return;
        }
        if (!this.focusedElement || !candidates.includes(this.focusedElement)) {
            this.setFocus(candidates[0]);
            return;
        }

        const currentRect = this.focusedElement.getBoundingClientRect();
        const currentX = currentRect.left + currentRect.width / 2;
        const currentY = currentRect.top + currentRect.height / 2;
        const target = candidates
            .filter(element => element !== this.focusedElement)
            .map(element => {
                const rect = element.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                const dx = x - currentX;
                const dy = y - currentY;
                const valid = (
                    (direction === 'left' && dx < -4) ||
                    (direction === 'right' && dx > 4) ||
                    (direction === 'up' && dy < -4) ||
                    (direction === 'down' && dy > 4)
                );
                const primary = direction === 'left' || direction === 'right' ? Math.abs(dx) : Math.abs(dy);
                const secondary = direction === 'left' || direction === 'right' ? Math.abs(dy) : Math.abs(dx);
                return { element, valid, score: primary * 3 + secondary };
            })
            .filter(option => option.valid)
            .sort((a, b) => a.score - b.score)[0];

        if (target) {
            this.setFocus(target.element);
        }
    }

    activateFocusedElement() {
        const candidates = this.getFocusableElements();
        if (!this.focusedElement || !candidates.includes(this.focusedElement)) {
            this.focusFirstElement();
            return;
        }
        this.focusedElement.click();
    }

    setFocus(element) {
        this.clearFocus();
        this.focusedElement = element;
        this.focusedElement.classList.add('gamepad-focus');
    }

    clearFocus() {
        if (this.focusedElement) {
            this.focusedElement.classList.remove('gamepad-focus');
        }
        this.focusedElement = null;
    }

    announce(message) {
        if (!this.status) {
            return;
        }
        this.status.textContent = message;
        this.status.classList.add('is-visible');
        clearTimeout(this.statusTimeout);
        this.statusTimeout = setTimeout(() => this.status.classList.remove('is-visible'), 4200);
    }
}
