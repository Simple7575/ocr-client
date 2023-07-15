export const odder = (previous: number, current: number) => {
    if (previous < current) {
        if (current % 2 !== 0) return current;
        return current + 1;
    } else {
        if (current % 2 !== 0) return current;
        return current - 1;
    }
};
