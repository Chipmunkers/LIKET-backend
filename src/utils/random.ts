export const numberString = (size = 6): string => {
    return Math.floor(Math.random() * 10 ** (size)).toString().padStart(size, '0');
}

export const number = (size = 6): number => {
    return Math.floor(Math.random() *
        10 ** (size));
}
