const LEVELS_CONFIG = [
    {
        number: 1,
        screenId: 'nivel-1',
        imagenId: 'imagen-nivel-1',
        imagenBtnId: 'continuar-nivel-1',
        nextBtnId: 'continuarbtn2',
        gridId: 'agentes-grid',
        verificarBtnId: 'verificar-btn',
        resultadoCorrectoId: 'resultado-correcto-nivel1',
        resultadoIncorrectoId: 'resultado-incorrecto-nivel1',
        correctAgents: [8, 13],
        resetsScoreOnReset: true
    },
    {
        number: 2,
        screenId: 'nivel-2',
        imagenId: 'imagen-nivel-2',
        imagenBtnId: 'continuar-nivel-2',
        nextBtnId: 'continuarbtn3',
        gridId: 'agentes-grid-nivel2',
        verificarBtnId: 'verificar-btn-nivel2',
        resultadoCorrectoId: 'resultado-correcto-nivel2',
        resultadoIncorrectoId: 'resultado-incorrecto-nivel2',
        correctAgents: [0, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
    },
    {
        number: 3,
        screenId: 'nivel-3',
        imagenId: 'imagen-nivel-3',
        imagenBtnId: 'continuar-nivel-3',
        nextBtnId: 'continuarbtn4',
        gridId: 'agentes-grid-nivel3',
        verificarBtnId: 'verificar-btn-nivel3',
        resultadoCorrectoId: 'resultado-correcto-nivel3',
        resultadoIncorrectoId: 'resultado-incorrecto-nivel3',
        correctAgents: [15, 16],
        showWrongSelectionsOnFail: true
    },
    {
        number: 4,
        screenId: 'nivel-4',
        imagenId: 'imagen-nivel-4',
        imagenBtnId: 'continuar-nivel-4',
        nextBtnId: 'continuarbtn5',
        gridId: 'agentes-grid-nivel4',
        verificarBtnId: 'verificar-btn-nivel4',
        resultadoCorrectoId: 'resultado-correcto-nivel4',
        resultadoIncorrectoId: 'resultado-incorrecto-nivel4',
        correctAgents: [10, 15, 16, 6],
        strict: true
    },
    {
        number: 5,
        screenId: 'nivel-5',
        imagenId: 'imagen-nivel-5',
        imagenBtnId: 'continuar-nivel-5',
        nextBtnId: 'continuarbtnRanking',
        gridId: 'agentes-grid-nivel5',
        verificarBtnId: 'verificar-btn-nivel5',
        resultadoCorrectoId: 'resultado-correcto-nivel5',
        resultadoIncorrectoId: 'resultado-incorrecto-nivel5',
        correctAgents: [0, 1, 6, 7, 9, 14],
        strict: true
    }
];

const SCREEN_IDS = [
    'pantalla-inicio',
    'login-step-1',
    'login-step-2',
    'menu',
    'about-screen',
    'levels',
    'configuration',
    'salas-multijugador',
    'agentes-screen',
    'lobby'
];

const MENU_NAVIGATION = {
    'menu-back-btn': ['menu', 'login-step-1'],
    'about-btn': ['menu', 'about-screen'],
    'about-continue-btn': ['about-screen', 'menu'],
    'levels-btn': ['menu', 'levels'],
    'menu-back': ['levels', 'menu'],
    'conf-btn': ['menu', 'configuration'],
    'configuration-back-btn': ['configuration', 'menu'],
    'btn-jugar': ['menu', 'agentes-screen'],
    'tutorial-next-btn': ['agentes-screen', 'salas-multijugador'],
    'singleplayer-btn': ['salas-multijugador', 'imagen-nivel-1'],
    'multiplayer-btn': ['salas-multijugador', 'lobby'],
    'salas-back-btn': ['salas-multijugador', 'menu'],
    'level-one': ['levels', 'lobby'],
    'lobby-btn': ['lobby', 'menu'],
    'continuar-al-nivel': ['lobby', 'imagen-nivel-1']
};

const RANKING_NAVIGATION = new Map([
    ['rank-btn', 1],
    ['ranki-btn1', 0],
    ['rank-btn2', 2],
    ['ranki-btn2', 1],
    ['rank-btn3', 3],
    ['ranki-btn3', 2],
    ['rank-btn4', 4],
    ['ranki-btn4', 3]
]);

class Game {
    constructor() {
        this.screens = new ScreenManager();
        this.user = new UserSession(sessionStorage, 'usuario', [
            'nombre-usuario',
            'nombre-usuario2',
            'nombre-usuario3',
            'nombre-usuario4',
            'nombre-usuario5',
            'nombre-usuario6'
        ].map(id => document.getElementById(id)).filter(display => display !== null));
        this.score = new ScoreManager(sessionStorage, 'puntos', [
            'puntos-input',
            'puntos-input-nivel2',
            'puntos-input-nivel3',
            'puntos-input-nivel4',
            'puntos-input-nivel5'
        ].map(id => document.getElementById(id)).filter(input => input !== null));
        this.auth = new AuthService(this.user);
        this.music = new MusicPlayer(document.getElementById('musicaFondo'), { volume: 0.5 });
        this.chat = new Chat({
            input: document.getElementById('chat-input'),
            messages: document.getElementById('chat-messages'),
            sendBtn: document.getElementById('chat-send-btn'),
            getUsername: () => this.user.get()
        });
        this.ranking = new Ranking({
            screens: ['ranking1', 'ranking2', 'ranking3', 'ranking4', 'ranking5']
                .map(id => document.getElementById(id))
                .filter(screen => screen !== null),
            navigation: RANKING_NAVIGATION,
            exitBtn: document.getElementById('rank-btn5'),
            onExit: () => this.returnToLobby(),
            resolveButton: id => document.getElementById(id)
        });
        this.levels = LEVELS_CONFIG.map(config => this.createLevel(config));
    }

    createLevel(config) {
        const views = {
            cards: new CardGrid(document.getElementById(config.gridId)),
            verifyBtn: document.getElementById(config.verificarBtnId),
            resultOk: document.getElementById(config.resultadoCorrectoId),
            resultFail: document.getElementById(config.resultadoIncorrectoId),
            nextBtn: document.getElementById(config.nextBtnId)
        };
        if (config.strict) {
            return new StrictLevel(config, views, {
                score: this.score,
                returnToLobby: () => this.returnToLobby()
            });
        }
        return new Level(config, views, { score: this.score });
    }

    init() {
        this.registerScreens();
        this.bindAuth();
        this.bindMenuNavigation();
        this.bindLevelFlow();
        this.ranking.bindEvents();
        this.chat.bindEvents();
        this.music.activateOnFirstClick(document);
    }

    registerScreens() {
        SCREEN_IDS.forEach(id => this.screens.register(document.getElementById(id)));
        LEVELS_CONFIG.forEach(config => {
            this.screens.register(document.getElementById(config.imagenId));
            this.screens.register(document.getElementById(config.screenId));
        });
    }

    onClick(id, handler) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', handler);
        }
    }

    bindAuth() {
        this.onClick('btn-iniciar', () => this.screens.go('pantalla-inicio', 'login-step-1'));
        this.onClick('register-btn', () => this.screens.go('login-step-1', 'login-step-2'));
        this.onClick('next-step-btn', () => this.login());
        this.onClick('login-btn', () => this.registerAccount());
    }

    login() {
        const result = this.auth.login(document.getElementById('username-input').value);
        if (!result.ok) {
            alert(result.message);
            return;
        }
        this.screens.hide('login-step-1', 'login-step-2');
        this.screens.show('menu');
    }

    registerAccount() {
        const result = this.auth.register({
            username: document.getElementById('reg-username').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            confirmPassword: document.getElementById('reg-confirm-password').value
        });
        if (!result.ok) {
            alert(result.message);
            return;
        }
        this.screens.hide('login-step-2');
        this.screens.show('menu');
    }

    bindMenuNavigation() {
        Object.entries(MENU_NAVIGATION).forEach(([btnId, [fromScreen, toScreen]]) => {
            this.onClick(btnId, () => this.screens.go(fromScreen, toScreen));
        });
    }

    bindLevelFlow() {
        LEVELS_CONFIG.forEach((config, index) => {
            const nextConfig = LEVELS_CONFIG[index + 1];
            this.onClick(config.imagenBtnId, () => {
                this.screens.hide(config.imagenId);
                this.screens.show(config.screenId);
                this.levels[index].enter();
            });
            this.onClick(config.nextBtnId, () => {
                this.screens.hide(config.screenId);
                if (nextConfig) {
                    this.screens.show(nextConfig.imagenId);
                } else {
                    this.ranking.open();
                }
            });
        });
    }

    returnToLobby() {
        LEVELS_CONFIG.forEach(config => {
            this.screens.hide(config.screenId, config.imagenId);
        });
        this.ranking.close();
        this.screens.show('lobby');
        this.levels[0].reset();
    }
}
