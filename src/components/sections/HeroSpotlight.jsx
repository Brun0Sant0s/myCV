import { useEffect, useRef, useState } from "react";

// A hidden wall behind the name with everything I have worked with, revealed by a light that wanders around on its own.
// Every visit shuffles the list and writes each item in a random code style (<React />, "Figma", Node.js(), // Scrum…),
// with the same syntax colours as the contact form.

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

// A new wall on every visit: the whole list shuffled over and over, random styles, indents and gaps.
// Only as many lines and characters as the screen can show (13px text, 1.9 line height), so phones get a light page.
const makeWall = () => {
    const rows = Math.ceil(Math.max(window.innerHeight, 560) / 24) + 2;
    const cols = Math.ceil(window.innerWidth / 7.5) + 20;
    let pool = [];
    return Array.from({ length: rows }, () => {
        const line = [[" ".repeat(rand(4) * 4)]];
        let length = 0;
        while (length < cols) {
            if (!pool.length) pool = shuffle(STACK);
            const pieces = STYLES[rand(STYLES.length)](pool.pop());
            line.push(...pieces, [" ".repeat(3 + rand(9))]);
            length += pieces.reduce((sum, [text]) => sum + text.length, 0) + 6;
        }
        return line;
    });
};

// Next spot for the light, as a share of the hero. On wide screens my avatar fills the right side and hides the code,
// so the light stays on the left half, behind the name.
const nextTarget = (host) => {
    const y = 0.1 + Math.random() * 0.8;
    if (host.clientWidth < 1024) return { x: 0.08 + Math.random() * 0.84, y };
    return { x: 0.05 + Math.random() * 0.5, y };
};

// The light is a black veil with a soft round hole, twice the size of the hero, moved with a transform.
// Moving it never repaints the code (a moving mask would, every frame), so it stays smooth on phones.
// It only runs while the hero is on screen and the tab is visible.
const VEIL = "radial-gradient(240px circle at 50% 50%, transparent 0%, #000 72%)";

const HeroSpotlight = () => {
    const hostRef = useRef(null);
    const veilRef = useRef(null);
    const [wall] = useState(makeWall);

    useEffect(() => {
        const host = hostRef.current;
        const veil = veilRef.current;
        if (!host || !veil) return undefined;

        let w = host.clientWidth;
        let h = host.clientHeight;
        let x = 0.5;
        let y = 0.5;
        const place = () => {
            veil.style.transform = `translate3d(${(x - 0.5) * w}px, ${(y - 0.5) * h}px, 0)`;
        };
        const resize = new ResizeObserver(() => {
            w = host.clientWidth;
            h = host.clientHeight;
            place();
        });
        resize.observe(host);
        place();

        // It stays in the middle if the visitor prefers less motion.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => resize.disconnect();

        // The light wanders on its own: it glides towards a random spot, and picks a new one before it gets there.
        let raf = null;
        let vx = 0;
        let vy = 0;
        let target = nextTarget(host);
        let last = 0;
        const loop = (t) => {
            const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
            last = t;
            if (Math.hypot(target.x - x, target.y - y) < 0.12) target = nextTarget(host);
            // A soft spring towards the target, with some drag, so the path curves instead of going straight
            vx = (vx + (target.x - x) * 1.1 * dt) * (1 - 1.4 * dt);
            vy = (vy + (target.y - y) * 1.1 * dt) * (1 - 1.4 * dt);
            x += vx * dt * 0.6;
            y += vy * dt * 0.6;
            place();
            raf = requestAnimationFrame(loop);
        };
        const start = () => {
            if (raf === null) {
                last = 0;
                raf = requestAnimationFrame(loop);
            }
        };
        const stop = () => {
            if (raf !== null) cancelAnimationFrame(raf);
            raf = null;
        };

        let onScreen = false;
        const sync = () => (onScreen && !document.hidden ? start() : stop());
        const seen = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            sync();
        });
        seen.observe(host);
        document.addEventListener("visibilitychange", sync);

        return () => {
            stop();
            seen.disconnect();
            resize.disconnect();
            document.removeEventListener("visibilitychange", sync);
        };
    }, []);

    return (
        <div ref={hostRef} aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <div className="absolute inset-0 font-mono text-[13px] leading-[1.9] p-6 text-left whitespace-pre opacity-60">
                {wall.map((line, i) => (
                    <div key={i}>
                        {line.map(([text, color], j) => (
                            <span key={j} style={color ? { color } : undefined}>
                                {text}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
            <div ref={veilRef} className="absolute -inset-full will-change-transform" style={{ background: VEIL }} />
        </div>
    );
};

export default HeroSpotlight;
