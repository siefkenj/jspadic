
export function* enumerateWords(len: number, base: number) {
    for (let i = 0; i < base ** len; i++) {
        const ret = [];
        let num = i;
        for (let pow = 1; pow <= len; pow++) {
            ret.push(num % base);
            num = Math.floor(num / base);
        }
        yield ret.reverse();
    }
}

export function isZero(arr: number[]) {
    return arr.every((v) => v === 0);
}
