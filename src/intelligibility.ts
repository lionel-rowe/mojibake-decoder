import { regex } from 'fancy-regex'
import { pipe } from 'fp-ts/lib/function'
import unicode from 'unicode-properties'

const sum = (xs: number[]) => xs.reduce((acc, cur) => acc + cur, 0)

const toBin = (bools: boolean[]) =>
    bools.reduce(
        (acc, cur, idx, arr) => acc | (Number(cur) << (arr.length - idx - 1)),
        0,
    )

const getBytes = (n: number) => {
    const out: number[] = []

    // eslint-disable-next-line no-cond-assign
    do {
        out.unshift(n & 0xff)
    } while ((n = n >> 8))

    return out
}

const countRuns = <T>(transform: (char: string) => T) => (str: string) =>
    [...str].reduce(
        (acc, char) => {
            const val = transform(char)

            return {
                prev: val,
                count: acc.count + Number(val !== acc.prev),
            }
        },
        { prev: Symbol('none') as T | Symbol, count: 0 },
    ).count

const countScriptRuns = countRuns((char) =>
    unicode.getScript(char.codePointAt(0)!),
)

const countExactSameCharRuns = countRuns((char) => char)

const countCaseRuns = countRuns((char) =>
    toBin(
        [
            unicode.isUpperCase,
            unicode.isLowerCase,
            unicode.isTitleCase,
        ].map((fn) => fn(char.codePointAt(0)!)),
    ),
)

const len = (str: string) => str.length

const higherIsBetter = (raw: number) => raw
const lowerIsBetter = (raw: number) => -raw

const countMatches = (re: RegExp) => (str: string) => str.match(re)?.length ?? 0

const countNullChars = countMatches(/\0/g)
const countReplacementChars = countMatches(/\ufffd/g)
const countUnspacedQuestionMarks = countMatches(/\?\S/g)
const countInvalidChars = countMatches(
    regex('gu')`
    \p{Cn}
    | \p{Cs}
    | \p{Co}
`,
)
const countUnprintableControlChars = countMatches(
    regex('gu')`
    [
        \x00-\x08   # 09 = TAB, 0a = NEWLINE
        \x0b-\x0c   # 0d = CARRIAGE RETURN
        \x0e-\x1f   # 20..7e are printable
        \x7f-\x9f
    ]
`,
)

const countNonCommonScriptsAfterFirst = (str: string) => {
    const scripts = [
        ...new Set(
            [...str].map((char) => unicode.getScript(char.codePointAt(0)!)),
        ),
    ]

    const n = scripts.filter((script) => !['Common', 'Latin'].includes(script))
        .length

    return Math.max(n - 1, 0)
}

const nonCommonLen = (str: string) =>
    [...str]
        .map((char) => unicode.getScript(char.codePointAt(0)!))
        .filter((script) => !['Common', 'Latin'].includes(script)).length

const countPunctuation = countMatches(
    regex('gu')`
    \p{P}
`,
)
const countOtherSymbols = countMatches(
    regex('gu')`
    \p{So}
`,
)
const totalCodePoints = (str: string) =>
    sum([...str].map((char) => char.codePointAt(0)!))

const similarityToOriginalMojibake = (str: string, original: string = '') =>
    [...str].filter((char) => original.includes(char)).length

// printable ascii start and end chars
const SPACE = ' '.codePointAt(0)!
const TILDE = '~'.codePointAt(0)!

const pctSuspiciouslyAsciiLikeButNotActualAsciiLevel = (str: string) => {
    const chars = [...str]

    const charBytes = chars.map((char) => getBytes(char.codePointAt(0)!))

    return (
        charBytes.filter(
            (charByte) =>
                charByte.length > 1 &&
                charByte.every((byte) => byte >= SPACE && byte <= TILDE),
        ).length / chars.length
    )
}

const pctQuestionMarks = (str: string) => {
    const chars = [...str]

    return chars.filter((char) => char === '?').length / chars.length
}

const pctIsoIec8859_1 = (str: string) => {
    const chars = [...str]

    return countMatches(/[\xa0-ÿ]/g)(str) / chars.length
}

const lowerIsBetterExponential = (multiplier: number, exponent: number) => (
    n: number,
) => 1 - (n * multiplier) ** exponent // lower is better, grows exponentially

const fns: [
    /* calculate: */ (str: string, original: string) => number,
    /* modify: */ (raw: number) => number,
    /* weighting? */ number?,
][] = [
    [countExactSameCharRuns, higherIsBetter],
    [countScriptRuns, lowerIsBetter],
    [countCaseRuns, lowerIsBetter, 1e2],
    [countNullChars, lowerIsBetter, 1e3],
    [countReplacementChars, lowerIsBetter, 1e3],
    [countUnspacedQuestionMarks, lowerIsBetter, 10],
    [countInvalidChars, lowerIsBetter, 1e3],
    [len, lowerIsBetter, 10],
    [nonCommonLen, lowerIsBetter, 10],
    [countUnprintableControlChars, lowerIsBetter, 1e3],
    [countNonCommonScriptsAfterFirst, lowerIsBetter, 1e3],
    [countOtherSymbols, lowerIsBetter],
    [countPunctuation, lowerIsBetter],
    [totalCodePoints, lowerIsBetter, 1e-8],
    [similarityToOriginalMojibake, higherIsBetter, 1e-8],
    // [
    //     pctSuspiciouslyAsciiLikeButNotActualAsciiLevel,
    //     lowerIsBetterExponential(10, 4),
    // ],
    [pctQuestionMarks, lowerIsBetterExponential(10, 4)],
    [pctIsoIec8859_1, lowerIsBetterExponential(5, 4)],
]

export const rateIntelligibility = (str: string, original: string) =>
    pipe(
        fns.map(([calculate, modify, weighting]) => {
            const result = calculate(str, original)

            // if (str === '场测') {
            //console.log(calculate.name, result)
            // }

            return pipe(result, modify, (x) => x * (weighting ?? 1))
        }),
        sum,
    )

// console.log(rateIntelligibility('场测', '│í▓Γ'))
