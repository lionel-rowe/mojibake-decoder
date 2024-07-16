import './styles.css'

import iconv from 'iconv-lite'
import { encodings } from './encodings'

import { rateIntelligibility } from './intelligibility'

import React, { FC, useEffect, useMemo, useState, useCallback } from 'react'
import { pipe } from 'fp-ts/lib/pipeable'
import {
    NavLink,
    Redirect,
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    useHistory,
} from 'react-router-dom'

function useQuery() {
    const { search } = useLocation()

    return useMemo(() => new URLSearchParams(search), [search])
}

const encode = (encoding: string) => (str: string) =>
    iconv.encode(str, encoding)
const decode = (encoding: string) => (buf: Buffer) =>
    iconv.decode(buf, encoding)

// TODO: consider split + process by line, truncating
// after n lines, to reduce processing time
for (const char of [...'\r\nA呃']) {
    console.log(
        char,
        encodings.reduce((obj, e) => {
            const x = [...encode(e)(char)]
                .map((n) => '\\x' + n.toString(16).padStart(2, '0'))
                .join('')

            obj[x] ??= []

            obj[x].push(e)

            return obj
        }, {} as Record<string, string[]>),
    )
}

// const from = 'cp437'
// const to = 'cp936'

// console.log(
//     pipe(
//         `天地玄黃，宇宙洪荒。日月盈昃，辰宿列張。寒來暑往，秋收冬藏。閏餘成歲，律呂調陽。雲騰致雨，露結為霜。金生麗水，玉出崑崗。劍號巨闕，珠稱夜光。果珍李柰，菜重芥薑。海鹹河淡，鱗潛羽翔。龍師火帝，鳥官人皇。始制文字，乃服衣裳。推位讓國，有虞陶唐。弔民伐罪，周發殷湯。坐朝問道，垂拱平章。愛育黎首，臣伏戎羌。遐邇壹體，率賓歸王。鳴鳳在樹，白駒食場。化被草木，賴及萬方。蓋此身髮，四大五常。恭惟鞠養，豈敢毀傷。女慕貞絜，男效才良。知過必改，得能莫忘。罔談彼短，靡恃己長。信使可覆，器欲難量。墨悲絲染，詩讚羔羊。景行維賢，剋念作聖。德建名立，形端表正。空谷傳聲，虛堂習聽。禍因惡積，福緣善慶。尺璧非寶，寸陰是競。資父事君，曰嚴與敬。孝當竭力，忠則盡命。臨深履薄，夙興溫凊。似蘭斯馨，如松之盛。川流不息，淵澄取映。容止若思，言辭安定。篤初誠美，慎終宜令。榮業所基，藉甚無竟。學優登仕，攝職從政。存以甘棠，去而益詠。樂殊貴賤，禮別尊卑。上和下睦，夫唱婦隨。外受傅訓，入奉母儀。諸姑伯叔，猶子比兒。孔懷兄弟，同氣連枝。交友投分，切磨箴規。仁慈隱惻，造次弗離。節義廉退，顛沛匪虧。性靜情逸，心動神疲。守真志滿，逐物意移。堅持雅操，好爵自縻。都邑華夏，東西二京。背邙面洛，浮渭據涇。宮殿盤鬱，樓觀飛驚。圖寫禽獸，畫綵仙靈。丙舍傍啟，甲帳對楹。肆筵設席，鼓瑟吹笙。升階納陛，弁轉疑星。右通廣內，左達承明。既集墳典，亦聚群英。杜稿鍾隸，漆書壁經。府羅將相，路俠槐卿。戶封八縣，家給千兵。高冠陪輦，驅轂振纓。世祿侈富，車駕肥輕。策功茂實，勒碑刻銘。磻溪伊尹，佐時阿衡。奄宅曲阜，微旦孰營。桓公匡合，濟弱扶傾。綺迴漢惠，說感武丁。俊乂密勿，多士寔寧。晉楚更霸，趙魏困橫。假途滅虢，踐土會盟。何遵約法，韓弊煩刑。起翦頗牧，用軍最精。宣威沙漠，馳譽丹青。九州禹跡，百郡秦并。嶽宗恒岱，禪主云亭。雁門紫塞，雞田赤城。昆池碣石，鉅野洞庭。曠遠綿邈，巖岫杳冥。治本於農，務茲稼穡。俶載南畝，我藝黍稷。稅熟貢新，勸賞黜陟。孟軻敦素，史魚秉直。庶幾中庸，勞謙謹敕。聆音察理，鑒貌辨色。貽厥嘉猷，勉其祗植。省躬譏誡，寵增抗極。殆辱近恥，林皋幸即。兩疏見機，解組誰逼。索居閒處，沉默寂寥。求古尋論，散慮逍遙。欣奏累遣，慼謝歡招。渠荷的歷，園莽抽條。枇杷晚翠，梧桐早凋。陳根委翳，落葉飄颻。遊鵾獨運，凌摩絳霄。耽讀翫市，寓目囊箱。易輶攸畏，屬耳垣牆。具膳餐飯，適口充腸。飽飫烹宰，飢厭糟糠。親戚故舊，老少異糧。妾御績紡，侍巾帷房。紈扇圓潔，銀燭煒煌。晝眠夕寐，藍筍象床。弦歌酒宴，接杯舉觴。矯手頓足，悅豫且康。嫡後嗣續，祭祀烝嘗。稽顙再拜，悚懼恐惶。牋牒簡要，顧答審詳。骸垢想浴，執熱願涼。驢騾犢特，駭躍超驤。誅斬賊盜，捕獲叛亡。布射遼丸，嵇琴阮嘯。恬筆倫紙，鈞巧任釣。釋紛利俗，並皆佳妙。毛施淑姿，工顰妍笑。年矢每催，曦暉朗曜。璇璣懸斡，晦魄環照。指薪修祜，永綏吉劭。矩步引領，俯仰廊廟。束帶矜莊，徘徊瞻眺。孤陋寡聞，愚蒙等誚。謂語助者，焉哉乎也。`,
//         encode(to),
//         decode(from),
//     ),
// )

const UTF_8 = 'utf8'

const truncate = (n: number) => (str: string) =>
    str.length > n ? str.slice(0, n) + '...' : str

const Decode: FC<{
    mojibake: string
    setMojibake: React.Dispatch<React.SetStateAction<string>>
}> = ({ mojibake, setMojibake }) => {
    const query = useQuery()
    const history = useHistory()

    const [from, setFrom] = useState(query.get('from') || UTF_8)
    const [to, setTo] = useState(query.get('to') || UTF_8)

    const decoded = pipe(mojibake.trim(), encode(from), decode(to))

    return (
        <>
            <h2>Decode</h2>

            <form>
                <div>
                    <label htmlFor='from'>From</label>{' '}
                    <select
                        defaultValue={from}
                        onChange={(e) => {
                            query.set('from', e.currentTarget.value)
                            history.replace({ search: query.toString() })
                            setFrom(e.currentTarget.value)
                        }}
                        id='from'
                    >
                        {encodings.map((x) => (
                            <option key={x}>{x}</option>
                        ))}
                    </select>{' '}
                    <label htmlFor='to'>to</label>{' '}
                    <select
                        defaultValue={to}
                        onChange={(e) => {
                            query.set('to', e.currentTarget.value)
                            history.replace({ search: query.toString() })
                            setTo(e.currentTarget.value)
                        }}
                        id='to'
                    >
                        {encodings.map((x) => (
                            <option key={x}>{x}</option>
                        ))}
                    </select>{' '}
                    <br />
                </div>

                <div>
                    <label htmlFor='mojibake'>Paste mojibake here:</label>
                </div>
                <div>
                    <textarea
                        onClick={(e) => e.currentTarget.select()}
                        id='mojibake'
                        value={mojibake}
                        onChange={(e) => setMojibake(e.currentTarget.value)}
                    />
                </div>

                {!!mojibake.trim() && (
                    <>
                        <div>
                            <label htmlFor='output'>
                                Copy output from here:
                            </label>
                        </div>
                        <div>
                            <textarea
                                onClick={(e) => e.currentTarget.select()}
                                id='output'
                                readOnly
                                value={decoded}
                            />
                        </div>
                    </>
                )}
            </form>
        </>
    )
}

const Diagnose: FC<{
    mojibake: string
    setMojibake: React.Dispatch<React.SetStateAction<string>>
    setFirst: React.Dispatch<React.SetStateAction<{ from: string; to: string }>>
}> = ({ mojibake, setMojibake, setFirst }) => {
    const all = useMemo(() => {
        const a = encodings.flatMap((from) =>
            encodings
                .filter((x) => x !== from)
                .map((to) => ({
                    mappings: [{ from, to }],
                    str: pipe(mojibake.trim(), encode(from), decode(to)),
                })),
        )

        return a
            .reduce((acc, cur) => {
                const existing = acc.find((x) => x.str === cur.str)

                if (existing) {
                    existing.mappings.push(cur.mappings[0])
                } else acc.push(cur)

                return acc
            }, [] as typeof a)
            .map((x) => {
                x.mappings = x.mappings.sort(
                    (a, b) =>
                        Number(b.from === UTF_8 || b.to === UTF_8) -
                        Number(a.from === UTF_8 || a.to === UTF_8),
                )

                return x
            })
            .sort(
                (a, b) =>
                    rateIntelligibility(a.str, mojibake) -
                    rateIntelligibility(b.str, mojibake),
            )
            .reverse()
    }, [mojibake])

    useEffect(() => {
        setFirst(
            mojibake.trim() ? all[0].mappings[0] : { from: UTF_8, to: UTF_8 },
        )
    }, [mojibake, all, setFirst])

    return (
        <>
            <h2>Diagnose</h2>

            <form>
                <div>
                    <label htmlFor='mojibake'>Paste mojibake here:</label>
                </div>
                <div>
                    <textarea
                        id='mojibake'
                        value={mojibake}
                        onChange={(e) => setMojibake(e.currentTarget.value)}
                    />
                </div>
            </form>

            {!!mojibake.trim() && (
                <>
                    <h3>Best guesses</h3>

                    {all.length ? (
                        <ol>
                            {all.slice(0, 500).map(({ str, mappings }, idx) => {
                                const mappingStr = mappings
                                    .map(({ from, to }) => `${from} ⇒ ${to}`)
                                    .join(', ')

                                return (
                                    <li key={idx}>
                                        <h4>
                                            <span title={mappingStr}>
                                                {truncate(50)(mappingStr)}
                                            </span>
                                        </h4>
                                        <p>{str}</p>
                                    </li>
                                )
                            })}
                        </ol>
                    ) : (
                        'None found'
                    )}
                </>
            )}
        </>
    )
}

const Routes: FC<{
    setFirst: React.Dispatch<React.SetStateAction<{ from: string; to: string }>>
}> = ({ setFirst }) => {
    const history = useHistory()
    const query = useQuery()

    const [mojibake, _setMojibake] = useState(
        () => query.get('mojibake') ?? '',
        // '╡RV╓ZTδRè TÜKÖRFΘRαGÉP\nárvízt√rï tükörfúrógép',
    )

    const setMojibake = useCallback((x: string) => {
        query.set('mojibake', x)
        history.replace({ search: query.toString() })
        _setMojibake(x)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Route exact path='/decode'>
                <Decode {...{ mojibake, setMojibake }} />
            </Route>

            <Route exact path='/'>
                <Redirect to='/diagnose' />
            </Route>

            <Route exact path='/diagnose'>
                <Diagnose {...{ setFirst, mojibake, setMojibake }} />
            </Route>
        </>
    )
}

export default function App() {
    const [first, setFirst] = useState({ from: UTF_8, to: UTF_8 })

    return (
        <div className='App'>
            <h1>Mojibake decoder</h1>

            <Router>
                <ul className='tabs'>
                    <li>
                        <NavLink activeClassName='current' to='/diagnose'>
                            Diagnose
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            activeClassName='current'
                            to={`/decode?${new URLSearchParams({
                                from: first.from,
                                to: first.to,
                            })}`}
                        >
                            Decode
                        </NavLink>
                    </li>
                </ul>

                <Switch>
                    <Routes {...{ setFirst }} />
                </Switch>
            </Router>
        </div>
    )
}
