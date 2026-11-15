import { useEffect, useRef } from "react";

// A hidden wall behind the name with everything I have worked with, revealed by a light that wanders around on its own.
// Every visit shuffles the list and writes each item in a random code style (<React />, "Figma", Node.js(), // Scrum…),
// with the same syntax colours as the contact form.
// The light position is written on the hero section (--x, --y).

// The languages, frameworks, tools and ways of working I use most
const STACK = [
    "React",
    "React Native",
    "Expo",
    "Angular",
    "TypeScript",
    "JavaScript",
    "jQuery",
    "HTML5",
    "CSS3",
    "Tailwind",
    "Node.js",
    "Firebase",
    "REST APIs",
    "SQL",
    "Java",
    "Git",
    "GitHub",
    "Vercel",
    "Figma",
    "UI/UX",
    "Responsive design",
    "Prototyping",
    "Product management",
    "Product design",
    "Requirements",
    "Scrum",
    "Agile",
];

const C = { kw: "#c792ea", tag: "#f07178", attr: "#ffcb6b", str: "#c3e88d", fn: "#82aaff", pn: "#89ddff", com: "#676e95", tx: "#d6deeb" };
const ident = (name) => name.replace(/[^A-Za-z0-9]/g, "");

// The ways an item can be written; each returns coloured pieces
const STYLES = [
    (n) => [
        ["<", C.pn],
        [ident(n), C.tag],
        [" />", C.pn],
    ],
    (n) => [[`"${n}"`, C.str]],
    (n) => [
        [ident(n), C.fn],
        ["()", C.pn],
    ],
    (n) => [[`// ${n}`, C.com]],
    (n) => [
        ["import ", C.kw],
        [ident(n), C.tx],
    ],
    (n) => [
        [ident(n).charAt(0).toLowerCase() + ident(n).slice(1), C.attr],
        ["={", C.pn],
        ["true", C.kw],
        ["}", C.pn],
    ],
    (n) => [[n, C.tx]],
    (n) => [[n, C.tx]],
];

const rand = (n) => Math.floor(Math.random() * n);
const shuffle = (list) => {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
        const k = rand(i + 1);
        [a[i], a[k]] = [a[k], a[i]];
    }
    return a;
};

// A new wall on every visit: the whole list shuffled over and over, random styles, indents and gaps
const makeWall = () => {
    let pool = [];
    return Array.from({ length: 90 }, () => {
        const line = [[" ".repeat(rand(4) * 4)]];
        let length = 0;
        while (length < 320) {
            if (!pool.length) pool = shuffle(STACK);
            const pieces = STYLES[rand(STYLES.length)](pool.pop());
            line.push(...pieces, [" ".repeat(3 + rand(9))]);
            length += pieces.reduce((sum, [text]) => sum + text.length, 0) + 6;
        }
        return line;
    });
};
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
