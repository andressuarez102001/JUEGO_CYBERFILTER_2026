class ScreenManager {
    constructor() {
        this.screens = new Map();
    }

    register(element) {
        if (element) {
            this.screens.set(element.id, element);
        }
        return element;
    }

    get(id) {
        return this.screens.get(id);
    }

    setVisible(id, visible) {
        const element = this.get(id);
        if (element) {
            element.classList.toggle('hidden', !visible);
        }
    }

    show(...ids) {
        ids.forEach(id => this.setVisible(id, true));
    }

    hide(...ids) {
        ids.forEach(id => this.setVisible(id, false));
    }

    go(hiddenId, visibleId) {
        this.hide(hiddenId);
        this.show(visibleId);
    }
}
