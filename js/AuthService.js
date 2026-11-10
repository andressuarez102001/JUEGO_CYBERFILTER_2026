class AuthService {
    constructor(userSession) {
        this.userSession = userSession;
    }

    login(username) {
        const name = String(username || '').trim();
        if (name.length <= 3) {
            return {
                ok: false,
                message: "ERROR DE ACCESO: El nombre de agente debe tener al menos 4 caracteres."
            };
        }
        this.userSession.save(name);
        return { ok: true };
    }

    register(fields) {
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
        if (!email || !email.includes('@')) {
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
        this.userSession.save(username);
        return { ok: true };
    }
}
