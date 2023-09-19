import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export const hash = (password: string): string => {
    const salt = genSaltSync(8);
    const hash = hashSync(password, salt);

    return hash;
}

export const compareHash = (password: string, hashedPassword: string): boolean => {
    if (!password) {
        return false;
    }

    if (!hashedPassword) {
        false;
    }

    return compareSync(password, hashedPassword);
}
