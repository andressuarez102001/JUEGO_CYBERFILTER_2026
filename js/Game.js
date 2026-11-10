class Game {
    constructor(options = {}) {
        this.doc = options.document || document;
        this.localStorage = options.localStorage || window.localStorage;
        this.sessionStorage = options.sessionStorage || window.sessionStorage;
        this.levelFactory = options.levelFactory || LevelFactory;

        this.screens = new ScreenManager();

        this.user = new UserSession(this.sessionStorage, 'usuario', [
            'nombre-usuario',
            'nombre-usuario2',
            'nombre-usuario3',
            'nombre-usuario4',
            'nombre-usuario5',
            'nombre-usuario6'
        ].map(id => this.doc.getElementById(id)).filter(display => display !== null));

        this.score = new ScoreManager(this.sessionStorage, 'puntos', [
            'puntos-input',
            'puntos-input-nivel2',
            'puntos-input-nivel3',
            'puntos-input-nivel4',
            'puntos-input-nivel5',
            'lobby-puntos'
        ].map(id => this.doc.getElementById(id)).filter(target => target !== null));

        this.auth = new AuthService(this.user, this.localStorage, options.hasher);
        this.leaderboard = new Leaderboard(this.localStorage);
        this.music = new MusicPlayer(this.doc.getElementById('musicaFondo'), { volume: 0.5 });
        this.chat = new Chat({
            input: this.doc.getElementById('chat-input'),
            messages: this.doc.getElementById('chat-messages'),
            sendBtn: this.doc.getElementById('chat-send-btn'),
            getUsername: () => this.user.get()
        });
        this.ranking = new Ranking({
            screens: ['ranking1', 'ranking2', 'ranking3', 'ranking4', 'ranking5']
                .map(id => this.doc.getElementById(id))
                .filter(screen => screen !== null),
            navigation: GameConfig.RANKING_NAVIGATION,
            exitBtn: this.doc.getElementById('rank-btn5'),
            onExit: () => this.returnToLobby(),
            resolveButton: id => this.doc.getElementById(id),
            leaderboard: this.leaderboard
        });

        this.levels = GameConfig.LEVELS.map(config => this.createLevel(config));
    }

    createLevel(config) {
        const views = {
            cards: new CardGrid(this.doc.getElementById(config.gridId)),
            verifyBtn: this.doc.getElementById(config.verificarBtnId),
            resultOk: this.doc.getElementById(config.resultadoCorrectoId),
            resultFail: this.doc.getElementById(config.resultadoIncorrectoId),
            nextBtn: this.doc.getElementById(config.nextBtnId),
            timer: this.doc.getElementById(config.timerId)
        };
        const deps = {
            score: this.score,
            onLevelComplete: levelNumber => this.handleLevelComplete(levelNumber),
            returnToLobby: () => this.returnToLobby()
        };
        return this.levelFactory.create(config, views, deps);
    }

    init() {
        this.registerScreens();
        this.bindAuth();
        this.bindMenuNavigation();
        this.bindRanking();
        this.bindLevelFlow();
        this.ranking.bindEvents();
        this.chat.bindEvents();
        this.music.activateOnFirstClick(this.doc);
        this.user.refresh();
        this.score.sync();
        this.refreshLobbyIdentity();
    }

    registerScreens() {
        GameConfig.SCREEN_IDS.forEach(id => this.screens.register(this.doc.getElementById(id)));
        GameConfig.LEVELS.forEach(config => {
            this.screens.register(this.doc.getElementById(config.imagenId));
            this.screens.register(this.doc.getElementById(config.screenId));
        });
    }

    onClick(id, handler) {
        const btn = this.doc.getElementById(id);
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

    async login() {
        const result = await this.auth.login(
            this.doc.getElementById('username-input').value,
            this.doc.getElementById('password-input').value
        );
        if (!result.ok) {
            alert(result.message);
            return;
        }
        this.screens.hide('login-step-1', 'login-step-2');
        this.screens.show('menu');
        this.refreshLobbyIdentity();
    }

    async registerAccount() {
        const result = await this.auth.register({
            username: this.doc.getElementById('reg-username').value,
            email: this.doc.getElementById('reg-email').value,
            password: this.doc.getElementById('reg-password').value,
            confirmPassword: this.doc.getElementById('reg-confirm-password').value
        });
        if (!result.ok) {
            alert(result.message);
            return;
        }
        this.screens.hide('login-step-2');
        this.screens.show('menu');
        this.refreshLobbyIdentity();
    }

    bindMenuNavigation() {
        Object.entries(GameConfig.MENU_NAVIGATION).forEach(([btnId, [fromScreen, toScreen]]) => {
            this.onClick(btnId, () => this.screens.go(fromScreen, toScreen));
        });
    }

    bindRanking() {
        this.onClick('ranking-btn', () => this.openRankingFromMenu());
    }

    bindLevelFlow() {
        GameConfig.LEVELS.forEach((config, index) => {
            const nextConfig = GameConfig.LEVELS[index + 1];
            this.onClick(config.imagenBtnId, () => {
                this.screens.hide(config.imagenId);
                this.screens.show(config.screenId);
                this.levels[index].enter();
            });
            this.onClick(config.nextBtnId, () => {
                this.levels[index].leave();
                this.screens.hide(config.screenId);
                if (nextConfig) {
                    this.screens.show(nextConfig.imagenId);
                } else {
                    this.finishRun();
                }
            });
        });
    }

    handleLevelComplete(levelNumber) {
        const name = this.user.get();
        if (!name) {
            return;
        }
        this.leaderboard.record(name, this.score.value, levelNumber);
    }

    refreshLobbyIdentity() {
        const name = this.user.get();
        if (!name) {
            return;
        }
        const display = this.doc.getElementById('player-name-1');
        if (display) {
            display.textContent = `${name} (Tu)`;
        }
    }

    openRankingFromMenu() {
        this.screens.hide('menu');
        this.ranking.open(() => this.screens.show('menu'));
    }

    finishRun() {
        this.levels.forEach(level => level.leave());
        GameConfig.LEVELS.forEach(config => {
            this.screens.hide(config.screenId, config.imagenId);
        });
        this.ranking.open(() => this.returnToLobby());
    }

    returnToLobby() {
        this.levels.forEach(level => {
            level.leave();
            level.reset();
        });
        GameConfig.LEVELS.forEach(config => {
            this.screens.hide(config.screenId, config.imagenId);
        });
        this.ranking.close();
        this.screens.show('lobby');
        this.score.sync();
    }
}
