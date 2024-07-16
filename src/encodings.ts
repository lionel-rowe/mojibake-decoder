import iconv from 'iconv-lite'

// initializes `iconv.encodings`
// (is null if `iconv.getEncoder` not called first)
iconv.getEncoder('utf8')

const isUncommonCpEncoding = (enc: string) =>
    enc.startsWith('cp') && ![437, 850, 852].includes(Number(enc.slice(2)))

// largely replaced with ISO
// const isWindowsEncoding = (enc: string) => enc.startsWith('windows')
// const isMacEncoding = (enc: string) => enc.startsWith('mac')

const reject = [isUncommonCpEncoding, /* isWindowsEncoding, isMacEncoding */]

export const encodings = ([
    ...new Set(
        Object.values((iconv as any).encodings).filter(
            (x) => typeof x === 'string',
        ),
    ),
] as string[])
    .filter(iconv.encodingExists)
    .filter((x) => !reject.some((fn) => fn(x)))
