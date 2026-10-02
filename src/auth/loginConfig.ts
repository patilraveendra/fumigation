export type UserRole = 'admin' | 'staff' | 'operator';

export type LoginUser = {
    username: string;
    password: string;
    role: UserRole;
};

export type LoginConfig = {
    users: LoginUser[];
};

export async function loadLoginConfig(): Promise<LoginConfig> {
    const response = await fetch('/config.json', { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`Could not load login config (${response.status}).`);
    }

    const data = (await response.json()) as Partial<LoginConfig>;
    if (!Array.isArray(data.users)) {
        throw new Error('Login config must contain a users array.');
    }

    return {
        users: data.users.map((user) => ({
            username: String(user?.username ?? '').trim(),
            password: String(user?.password ?? ''),
            role: (String(user?.role ?? 'staff').trim().toLowerCase() as UserRole),
        })),
    };
}

export function findMatchingUser(config: LoginConfig, username: string, password: string): LoginUser | null {
    const enteredUser = username.trim();
    if (!enteredUser || !password) {
        return null;
    }

    return config.users.find(
        (user) => user.username === enteredUser && user.password.length > 0 && user.password === password,
    ) ?? null;
}

export function credentialsMatch(config: LoginConfig, username: string, password: string): boolean {
    return findMatchingUser(config, username, password) !== null;
}
