class PasswordHasher {
    static SALT = 'cyberfilter::salt::v1';

    #salt;

    constructor(salt = PasswordHasher.SALT) {
        this.#salt = salt;
    }

    async hash(password) {
        const value = `${this.#salt}:${password}`;
        if (window.crypto && window.crypto.subtle && window.TextEncoder) {
            try {
                const data = new TextEncoder().encode(value);
                const digest = await window.crypto.subtle.digest('SHA-256', data);
                return Array.from(new Uint8Array(digest))
                    .map(byte => byte.toString(16).padStart(2, '0'))
                    .join('');
            } catch (error) {
                console.warn('Crypto no disponible, usando hash alternativo:', error);
            }
        }
        return this.fallback(value);
    }

    fallback(value) {
        let h1 = 0xdeadbeef;
        let h2 = 0x41c6ce57;
        for (let i = 0; i < value.length; i += 1) {
            const charCode = value.charCodeAt(i);
            h1 = Math.imul(h1 ^ charCode, 2654435761);
            h2 = Math.imul(h2 ^ charCode, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        const partOne = (h2 >>> 0).toString(16).padStart(8, '0');
        const partTwo = (h1 >>> 0).toString(16).padStart(8, '0');
        return `${partOne}${partTwo}`;
    }
}
