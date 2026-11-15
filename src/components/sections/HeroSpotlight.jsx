import { useEffect, useRef } from "react";

// A hidden wall of code behind the name, revealed by a light that wanders around on its own.
// The wall mixes snippets of everything I work with (React, React Native, Angular, Node, Firebase, CSS, SQL, Git…),
// shuffled and indented at random on every visit, with the same syntax colours as the contact form.
// The light position is written on the hero section (--x, --y).

const SNIPPETS = [
    'import { useState } from "react";',
    "const [projects, setProjects] = useState([]);",
    "useEffect(() => { load(); }, []);",
    "export default function App() {",
    'return <Portfolio owner="Bruno" />;',
    '<Route path="/projects" element={<Projects />} />',
    "<motion.div animate={{ opacity: 1, y: 0 }} />",
    'className="flex items-center gap-4"',
    "<View style={styles.card}>",
    'navigation.navigate("Booking", { id });',
    "const db = getFirestore(app);",
    'await setDoc(doc(db, "orders", id), order);',
    "onSnapshot(query(tables), (snap) => render(snap));",
    'app.get("/api/services", auth, list);',
    "res.status(200).json({ ok: true });",
    "ng generate component timeline",
    "@Input() event!: TimelineEvent;",
    "this.form = this.fb.group({ email: [''] });",
    "interface Project { id: string; year: number }",
    'type Lang = "en" | "pt";',
    "const total = items.reduce((s, i) => s + i.price, 0);",
    '$(".menu").toggleClass("open");',
    "public class Main { }",
    "SELECT * FROM shows WHERE year = 2025;",
    ".hero { color: #20C997; }",
    "@media (max-width: 768px) { }",
    "grid-template-columns: repeat(3, 1fr);",
    'git commit -m "ship it"',
    "git push origin main",
    "npm run deploy",
    "npx expo start",
    "// TODO: more coffee",
    "// it works on my machine",
    "if (!user) return null;",
    "for (const cue of cues) fire(cue);",
    "setTimeout(reveal, 3000);",
    'fetch("/api/rides").then((r) => r.json());',
    "const fps = 60;",
    '<Bruno role="frontend" />',
    '{ "react": "^19.0.0" }',
    "while (alive) build();",
    "debugger;",
];

const KEYWORDS = new Set(
    "import from export default function return const let if for of while await async new public class interface type this null true false".split(" ")
);
const C = { kw: "#c792ea", tag: "#f07178", attr: "#ffcb6b", str: "#c3e88d", fn: "#82aaff", pn: "#89ddff", com: "#676e95", num: "#f78c6c", tx: "#d6deeb" };

// Splits a snippet into coloured pieces: comments, strings, <Tags, attr=, keywords, calls(, numbers, punctuation
const TOKEN =
    /(\/\/.*?(?=\s{4}|$))|("[^"]*"|'[^']*')|(<\/?[A-Za-z.]+)|([A-Za-z-]+)(?==)|(\b\d+\b|#[0-9A-Fa-f]{3,6}\b)|([A-Za-z_$][\w$]*)(?=\()|([A-Za-z_$@][\w$!-]*)|([^\sA-Za-z0-9_$]+)|(\s+)/g;
const tokenize = (code) =>
    [...code.matchAll(TOKEN)].map((m) => {
        const [text, com, str, tag, attr, num, fn, word] = m;
        if (com) return [text, C.com];
        if (str) return [text, C.str];
        if (tag) return [text, C.tag];
        if (attr) return [text, C.attr];
        if (num) return [text, C.num];
        if (fn) return [text, C.fn];
        if (word) return [text, KEYWORDS.has(word) ? C.kw : C.tx];
        return [text, m[8] ? C.pn : undefined];
    });

const pick = (list) => list[Math.floor(Math.random() * list.length)];

// A new wall on every visit: lines of 2 to 4 random snippets, random indents and gaps
const makeWall = () =>
    Array.from({ length: 90 }, () => {
        let line = " ".repeat(Math.floor(Math.random() * 4) * 4);
        while (line.length < 320) line += pick(SNIPPETS) + " ".repeat(4 + Math.floor(Math.random() * 10));
        return tokenize(line);
    });
const WALL = makeWall();

// Next spot for the light, as a share of the hero. On wide screens my avatar fills the middle and hides the code,
// so the light mostly heads for the free space on either side (it still crosses behind me on the way).
const nextTarget = (host) => {
    const y = 0.1 + Math.random() * 0.8;
    if (host.clientWidth < 1024) return { x: 0.08 + Math.random() * 0.84, y };
    const side = Math.random() < 0.5 ? 0 : 1;
    return { x: side ? 0.7 + Math.random() * 0.25 : 0.05 + Math.random() * 0.25, y };
};

const HeroSpotlight = () => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        const host = el?.parentElement;
        if (!el || !host) return undefined;
        const set = (x, y) => {
            host.style.setProperty("--x", `${x}px`);
            host.style.setProperty("--y", `${y}px`);
        };
        const r0 = host.getBoundingClientRect();
        set(r0.width / 2, r0.height / 2);

        // The light wanders on its own: it glides towards a random spot, and picks a new one before it gets there.
        // It stays in the middle if the visitor prefers less motion.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
        let raf;
        let x = 0.5;
        let y = 0.5;
        let vx = 0;
        let vy = 0;
        let target = nextTarget(host);
        let last = performance.now();
        const loop = (t) => {
            const dt = Math.min(0.05, (t - last) / 1000);
            last = t;
            if (Math.hypot(target.x - x, target.y - y) < 0.12) target = nextTarget(host);
            // A soft spring towards the target, with some drag, so the path curves instead of going straight
            vx = (vx + (target.x - x) * 1.1 * dt) * (1 - 1.4 * dt);
            vy = (vy + (target.y - y) * 1.1 * dt) * (1 - 1.4 * dt);
            x += vx * dt * 0.6;
            y += vy * dt * 0.6;
            const r = host.getBoundingClientRect();
            set(r.width * x, r.height * y);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    const mask = "radial-gradient(240px circle at var(--x, 50%) var(--y, 50%), #000 0%, transparent 72%)";

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none select-none font-mono text-[13px] leading-[1.9] p-6 text-left whitespace-pre opacity-60"
            style={{ WebkitMaskImage: mask, maskImage: mask }}
        >
            {WALL.map((line, i) => (
                <div key={i}>
                    {line.map(([text, color], j) => (
                        <span key={j} style={color ? { color } : undefined}>
                            {text}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default HeroSpotlight;
