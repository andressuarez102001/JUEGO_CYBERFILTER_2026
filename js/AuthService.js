class AuthService extends StorageRepository {
    static STORAGE_KEY = 'cyberfilter_users';

    #userSession;
    #hasher;

    constructor(userSession, storage, hasher = new PasswordHasher()) {
        super(storage, AuthService.STORAGE_KEY);
        this.#userSession = userSession;
        this.#hasher = hasher;
    }

    onWriteError(error) {
        console.error('No se pudieron guardar las cuentas:', error);
    }

    async login(username, password) {
        const name = String(username || '').trim();
        const pass = String(password || '');
        if (name.length <= 3) {
            return {
                ok: false,
                message: "ERROR DE ACCESO: El nombre de agente debe tener al menos 4 caracteres."
            };
        }
        const users = this.readJSON({});
        const record = users[name.toLowerCase()];
        if (!record) {
            return {
                ok: false,
                message: "ERROR DE ACCESO: Ese agente no está registrado. Usa 'Regístrate Aquí'."
            };
        }
        const hash = await this.#hasher.hash(pass);
        if (record.passwordHash !== hash) {
            return {
                ok: false,
                message: "ERROR DE ACCESO: Contraseña incorrecta."
            };
        }
        this.#userSession.save(record.username || name);
        return { ok: true };
    }

    async register(fields) {
        const username = String(fields.username || '').trim();
        const email = String(fields.email || '').trim();
        const password = String(fields.password || '');
        const confirmPassword = String(fields.confirmPassword || '');

        if (username.length < 4) {
            return {
                ok: false,
                message: "ERROR DE REGISTRO: El nombre de agente debe tener al menos 4 caracteres."
            };
        }
        if (!email || !email.includes('@') || !email.includes('.')) {
            return {
                ok: false,
                message: "ERROR DE REGISTRO: Ingresa un email válido."
            };
        }
        if (password.length < 6) {
            return {
                ok: false,
                message: "ERROR DE REGISTRO: La contraseña debe tener al menos 6 caracteres."
            };
        }
        if (password !== confirmPassword) {
            return {
                ok: false,
                message: "ERROR DE REGISTRO: Las contraseñas no coinciden."
            };
        }

        const users = this.readJSON({});
        if (users[username.toLowerCase()]) {
            return {
                ok: false,
                message: "ERROR DE REGISTRO: Ya existe un agente con ese nombre."
            };
        }

        const passwordHash = await this.#hasher.hash(password);
        users[username.toLowerCase()] = {
            username,
            email,
            passwordHash,
            createdAt: Date.now()
        };
        this.writeJSON(users);
        this.#userSession.save(username);
        return { ok: true };
    }
}
