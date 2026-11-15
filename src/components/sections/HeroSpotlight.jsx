import { useEffect, useRef } from "react";

// A hidden wall of the stack written as code behind the name, revealed by a light that drifts slowly on its own.
// The light position is written on the hero section (--x, --y).
const TECH = [
    "React",
    "TypeScript",
    "React Native",
    "Expo",
    "Firebase",
    "Node.js",
    "Angular",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Tailwind",
    "Figma",
    "Git",
    "REST",
    "jQuery",
    "Java",
];

const WALL = Array.from({ length: 1600 }, (_, i) => {
    const t = TECH[(i * 7) % TECH.length];
    return { t, tag: i % 9 === 0 };
});

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

        // The light wanders gently on its own; it stays in the middle if the visitor prefers less motion.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
        let raf;
        const start = performance.now();
        const loop = (t) => {
            const r = host.getBoundingClientRect();
            const sec = (t - start) / 1000;
            set(r.width * (0.5 + 0.32 * Math.sin(sec * 0.5)), r.height * (0.5 + 0.28 * Math.sin(sec * 0.37 + 1)));
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    const mask = "radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), #000 0%, transparent 72%)";

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none select-none font-mono text-[13px] leading-[1.9] text-white/[0.12] p-6 text-left"
            style={{ wordSpacing: 10, WebkitMaskImage: mask, maskImage: mask }}
        >
            {WALL.map((w, i) => (w.tag ? <span key={i} className="text-[#20C997]/60">{`<${w.t}/> `}</span> : <span key={i}>{`${w.t} `}</span>))}
        </div>
    );
};

export default HeroSpotlight;
