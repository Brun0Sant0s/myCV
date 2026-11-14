import { useEffect, useRef, useState } from "react";

// Navigation styled as the tab bar of a code editor: one .jsx file per section, the open tab is where you are.
const SECTIONS = [
    { file: "Home", ext: ".jsx", top: true },
    { file: "About", ext: ".jsx", id: "aboutMeContent", target: "aboutMeContent" },
    { file: "Experience", ext: ".jsx", id: "professionalExperienceText", target: "professionalExperienceText" },
    { file: "Projects", ext: ".jsx", id: "projectsText", target: "projectsText" },
    { file: "Certifications", ext: ".jsx", id: "certificationsText", target: "certificationsText" },
    { file: "Contact", ext: ".jsx", id: "contactsText", target: "contactsText" },
];

const ReactIcon = () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#61DAFB" strokeWidth="1.4" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.6" fill="#61DAFB" stroke="none" />
    </svg>
);

const EditorNav = () => {
    const [current, setCurrent] = useState(0);
    const tabsRef = useRef(null);

    useEffect(() => {
        let frame = null;
        const update = () => {
            frame = null;
            const line = window.innerHeight * 0.45;
            let cur = 0;
            SECTIONS.forEach((s, i) => {
                if (s.top) return;
                const el = document.getElementById(s.id);
                if (el && el.getBoundingClientRect().top <= line) cur = i;
            });
            setCurrent(cur);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    // Keep the open tab visible on narrow screens
    useEffect(() => {
        const tab = tabsRef.current?.children[current];
        tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }, [current]);

    const goTo = (i) => {
        const s = SECTIONS[i];
        if (s.top) window.scrollTo({ top: 0, behavior: "smooth" });
        else document.getElementById(s.target)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav
            aria-label="Sections"
            className="fixed z-40 left-1/2 -translate-x-1/2 bottom-[max(16px,env(safe-area-inset-bottom))] max-w-[calc(100vw-32px)] rounded-xl border border-white/20 bg-[#0a0a0c]/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden"
        >
            <div ref={tabsRef} className="flex overflow-x-auto font-mono text-[12px] sm:text-[13px] [scrollbar-width:none]">
                {SECTIONS.map((s, i) => {
                    const on = i === current;
                    return (
                        <button
                            key={s.file}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-current={on ? "page" : undefined}
                            className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2.5 whitespace-nowrap border-r border-white/[0.08] last:border-r-0 transition-colors ${
                                on ? "bg-white/[0.07] text-white" : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]"
                            }`}
                        >
                            {on && <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#20C997]" />}
                            <ReactIcon />
                            <span>
                                {s.file}
                                <span className="hidden sm:inline text-gray-600">{s.ext}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default EditorNav;
