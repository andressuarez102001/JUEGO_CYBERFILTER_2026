class GameConfig {
    static SCREEN_IDS = Object.freeze([
        'pantalla-inicio',
        'login-step-1',
        'login-step-2',
        'menu',
        'about-screen',
        'levels',
        'salas-multijugador',
        'agentes-screen',
        'lobby'
    ]);

    static MENU_NAVIGATION = Object.freeze({
        'menu-back-btn': Object.freeze(['menu', 'login-step-1']),
        'about-btn': Object.freeze(['menu', 'about-screen']),
        'about-continue-btn': Object.freeze(['about-screen', 'menu']),
        'levels-btn': Object.freeze(['menu', 'levels']),
        'menu-back': Object.freeze(['levels', 'menu']),
        'btn-jugar': Object.freeze(['menu', 'agentes-screen']),
        'tutorial-next-btn': Object.freeze(['agentes-screen', 'salas-multijugador']),
        'singleplayer-btn': Object.freeze(['salas-multijugador', 'imagen-nivel-1']),
        'salas-back-btn': Object.freeze(['salas-multijugador', 'menu']),
        'level-one': Object.freeze(['levels', 'lobby']),
        'lobby-btn': Object.freeze(['lobby', 'menu']),
        'continuar-al-nivel': Object.freeze(['lobby', 'imagen-nivel-1'])
    });

    static LEVELS = Object.freeze([
        new LevelConfig({
            number: 1,
            type: 'normal',
            screenId: 'nivel-1',
            imagenId: 'imagen-nivel-1',
            imagenBtnId: 'continuar-nivel-1',
            nextBtnId: 'continuarbtn2',
            gridId: 'agentes-grid',
            verificarBtnId: 'verificar-btn',
            resultadoCorrectoId: 'resultado-correcto-nivel1',
            resultadoIncorrectoId: 'resultado-incorrecto-nivel1',
            timerId: 'timer-nivel-1',
            correctAgents: [8, 13],
            retryQuestion: {
                question: '¿Cuántos elementos tiene el conjunto {1, 2, 3}?',
                options: ['2', '3', '4'],
                correctOption: 1
            },
            timeLimit: 30,
            resetsScoreOnReset: true
        }),
        new LevelConfig({
            number: 2,
            type: 'normal',
            screenId: 'nivel-2',
            imagenId: 'imagen-nivel-2',
            imagenBtnId: 'continuar-nivel-2',
            nextBtnId: 'continuarbtn3',
            gridId: 'agentes-grid-nivel2',
            verificarBtnId: 'verificar-btn-nivel2',
            resultadoCorrectoId: 'resultado-correcto-nivel2',
            resultadoIncorrectoId: 'resultado-incorrecto-nivel2',
            timerId: 'timer-nivel-2',
            correctAgents: [0, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            retryQuestion: {
                question: 'Si A = {1, 2, 3} y B = {3, 4}, ¿cuál es A ∩ B?',
                options: ['{1, 2, 3, 4}', '{3}', '{1, 2}'],
                correctOption: 1
            },
            timeLimit: 30
        }),
        new LevelConfig({
            number: 3,
            type: 'normal',
            screenId: 'nivel-3',
            imagenId: 'imagen-nivel-3',
            imagenBtnId: 'continuar-nivel-3',
            nextBtnId: 'continuarbtn4',
            gridId: 'agentes-grid-nivel3',
            verificarBtnId: 'verificar-btn-nivel3',
            resultadoCorrectoId: 'resultado-correcto-nivel3',
            resultadoIncorrectoId: 'resultado-incorrecto-nivel3',
            timerId: 'timer-nivel-3',
            correctAgents: [0, 15],
            retryQuestion: {
                question: '¿Cuál es el 25% de 80?',
                options: ['20', '25', '40'],
                correctOption: 0
            },
            timeLimit: 30,
            showWrongSelectionsOnFail: true
        }),
        new LevelConfig({
            number: 4,
            type: 'strict',
            screenId: 'nivel-4',
            imagenId: 'imagen-nivel-4',
            imagenBtnId: 'continuar-nivel-4',
            nextBtnId: 'continuarbtn5',
            gridId: 'agentes-grid-nivel4',
            verificarBtnId: 'verificar-btn-nivel4',
            resultadoCorrectoId: 'resultado-correcto-nivel4',
            resultadoIncorrectoId: 'resultado-incorrecto-nivel4',
            timerId: 'timer-nivel-4',
            correctAgents: [0, 6, 10, 15],
            retryQuestion: {
                question: '¿Qué valores satisfacen x² − 5x + 6 = 0?',
                options: ['x = 1 y x = 6', 'x = 2 y x = 3', 'x = −2 y x = −3'],
                correctOption: 1
            },
            timeLimit: 30,
            strict: true
        }),
        new LevelConfig({
            number: 5,
            type: 'strict',
            screenId: 'nivel-5',
            imagenId: 'imagen-nivel-5',
            imagenBtnId: 'continuar-nivel-5',
            nextBtnId: 'continuarbtnRanking',
            gridId: 'agentes-grid-nivel5',
            verificarBtnId: 'verificar-btn-nivel5',
            resultadoCorrectoId: 'resultado-correcto-nivel5',
            resultadoIncorrectoId: 'resultado-incorrecto-nivel5',
            timerId: 'timer-nivel-5',
            correctAgents: [0, 1, 6, 7, 9, 14],
            retryQuestion: {
                question: 'Si todos los A pertenecen a B y x pertenece a A, ¿qué se concluye?',
                options: ['x pertenece a B', 'x no pertenece a B', 'No se puede concluir nada'],
                correctOption: 0
            },
            timeLimit: 30,
            strict: true
        })
    ]);
}
