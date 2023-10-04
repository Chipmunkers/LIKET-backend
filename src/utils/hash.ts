import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export const hash = (password: string): string => {
    const salt = genSaltSync(8);
    const hash = hashSync(password, salt);

    return hash;
}

export const compareHash = (password: string, hashedPassword: string | null): boolean => {
    if (!password) {
        return false;
    }

    if (!hashedPassword) {
        return false;
    }

    return compareSync(password, hashedPassword);
}
