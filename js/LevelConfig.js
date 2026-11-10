class LevelConfig {
    #data;

    constructor(data) {
        const config = Object.freeze({
            number: Number(data.number),
            type: String(data.type || (data.strict ? 'strict' : 'normal')),
            screenId: String(data.screenId),
            imagenId: String(data.imagenId),
            imagenBtnId: String(data.imagenBtnId),
            nextBtnId: String(data.nextBtnId),
            gridId: String(data.gridId),
            verificarBtnId: String(data.verificarBtnId),
            resultadoCorrectoId: String(data.resultadoCorrectoId),
            resultadoIncorrectoId: String(data.resultadoIncorrectoId),
            timerId: String(data.timerId),
            correctAgents: Object.freeze([...data.correctAgents].map(Number)),
            retryQuestion: Object.freeze({
                question: String(data.retryQuestion?.question || ''),
                options: Object.freeze((data.retryQuestion?.options || []).map(String)),
                correctOption: Number(data.retryQuestion?.correctOption)
            }),
            timeLimit: Number(data.timeLimit) || 0,
            strict: Boolean(data.strict),
            resetsScoreOnReset: Boolean(data.resetsScoreOnReset),
            showWrongSelectionsOnFail: Boolean(data.showWrongSelectionsOnFail)
        });

        if (!Number.isInteger(config.number) || config.number < 1) {
            throw new Error('LevelConfig requiere un número de nivel válido.');
        }
        if (config.correctAgents.length === 0) {
            throw new Error(`El nivel ${config.number} debe tener al menos un agente correcto.`);
        }
        if (
            !config.retryQuestion.question ||
            config.retryQuestion.options.length < 2 ||
            !Number.isInteger(config.retryQuestion.correctOption) ||
            config.retryQuestion.correctOption < 0 ||
            config.retryQuestion.correctOption >= config.retryQuestion.options.length
        ) {
            throw new Error(`El nivel ${config.number} requiere una pregunta de recuperación válida.`);
        }

        this.#data = config;
    }

    get number() {
        return this.#data.number;
    }

    get type() {
        return this.#data.type;
    }

    get screenId() {
        return this.#data.screenId;
    }

    get imagenId() {
        return this.#data.imagenId;
    }

    get imagenBtnId() {
        return this.#data.imagenBtnId;
    }

    get nextBtnId() {
        return this.#data.nextBtnId;
    }

    get gridId() {
        return this.#data.gridId;
    }

    get verificarBtnId() {
        return this.#data.verificarBtnId;
    }

    get resultadoCorrectoId() {
        return this.#data.resultadoCorrectoId;
    }

    get resultadoIncorrectoId() {
        return this.#data.resultadoIncorrectoId;
    }

    get timerId() {
        return this.#data.timerId;
    }

    get correctAgents() {
        return this.#data.correctAgents;
    }

    get retryQuestion() {
        return this.#data.retryQuestion;
    }

    get timeLimit() {
        return this.#data.timeLimit;
    }

    get strict() {
        return this.#data.strict;
    }

    get resetsScoreOnReset() {
        return this.#data.resetsScoreOnReset;
    }

    get showWrongSelectionsOnFail() {
        return this.#data.showWrongSelectionsOnFail;
    }
}
