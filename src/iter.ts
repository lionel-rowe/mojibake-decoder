type SafeInt = number & { readonly safeInt: unique symbol }

const isSafeInteger = (n: unknown): n is SafeInt =>
    typeof n === 'number' &&
    !isNaN(n) &&
    !(n % 1) &&
    n >= Number.MIN_SAFE_INTEGER &&
    n <= Number.MAX_SAFE_INTEGER

export const map = <TArg, TReturn>(fn: (arg: TArg) => TReturn) => (
    iter: Iterable<TArg>,
): Iterable<TReturn> => ({
    *[Symbol.iterator]() {
        for (const x of iter) yield fn(x)
    },
})

export const filter = <TArg, TReturn>(fn: (arg: TArg) => TReturn) => (
    iter: Iterable<TArg>,
): Iterable<TArg> => ({
    *[Symbol.iterator]() {
        for (const x of iter) {
            if (fn(x)) yield x
        }
    },
})

export const reduce = <TArg, TReturn>(
    init: TReturn,
    fn: (acc: TReturn, cur: TArg) => TReturn,
) => (iter: Iterable<TArg>): Iterable<TReturn> => ({
    *[Symbol.iterator]() {
        let acc = init

        for (const cur of iter) {
            yield (acc = fn(acc, cur))
        }
    },
})

export const take = <T>(n: number) => (iter: Iterable<T>): Array<T> => {
    const arr: Array<T> = []

    for (const x of iter) {
        arr.push(x)

        if (arr.length >= n) break
    }

    return arr
}

export const range = (min: number, max: number) => {
    if (![min, max].every(isSafeInteger)) {
        throw new RangeError('Not a safe int')
    }

    return {
        *[Symbol.iterator]() {
            for (let n = min; n <= max; n++) yield n
        },
        min,
        max,
        toString: () => `${min}..${max}`,
        includes: (n: number) => isSafeInteger(n) && n >= min && n <= max,
    }
}

// use with care!
export const infinite = () => {
    return {
        *[Symbol.iterator]() {
            while (true) yield
        },
    }
}
