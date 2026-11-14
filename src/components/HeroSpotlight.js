import { useEffect, useRef } from "react";

// A hidden wall of the stack written as code behind the name.
// The cursor works like a torch and reveals it; on touch screens the light drifts slowly on its own.
const TECH = ["React", "TypeScript", "React Native", "Expo", "Firebase", "Node.js", "Angular", "JavaScript", "HTML5", "CSS3", "Tailwind", "Figma", "Git", "REST", "jQuery", "Java"];

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
            el.style.setProperty("--x", `${x}px`);
            el.style.setProperty("--y", `${y}px`);
        };
        const r0 = host.getBoundingClientRect();
        set(r0.width / 2, r0.height / 2);

        const onMove = (e) => {
            const r = host.getBoundingClientRect();
            set(e.clientX - r.left, e.clientY - r.top);
        };
        host.addEventListener("pointermove", onMove);

        // No mouse (phones, tablets): let the light wander gently, unless the user prefers less motion.
        let raf;
        const fine = window.matchMedia("(pointer: fine)").matches;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!fine && !reduce) {
            const start = performance.now();
            const loop = (t) => {
                const r = host.getBoundingClientRect();
                const s = (t - start) / 1000;
                set(r.width * (0.5 + 0.32 * Math.sin(s * 0.5)), r.height * (0.5 + 0.28 * Math.sin(s * 0.37 + 1)));
                raf = requestAnimationFrame(loop);
            };
            raf = requestAnimationFrame(loop);
        }
        return () => {
            host.removeEventListener("pointermove", onMove);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const mask = "radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), #000 0%, transparent 72%)";

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none select-none font-mono text-[13px] leading-[1.9] text-white/[0.12] p-6 text-left"
            style={{ wordSpacing: 10, WebkitMaskImage: mask, maskImage: mask }}
        >
            {WALL.map((w, i) =>
                w.tag ? (
                    <span key={i} className="text-[#20C997]/60">{`<${w.t}/> `}</span>
                ) : (
                    <span key={i}>{`${w.t} `}</span>
                )
            )}
        </div>
    );
};

export default HeroSpotlight;
