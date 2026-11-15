import { useEffect, useRef, useState } from "react";
import { useLang } from "../../i18n/LanguageContext";

// Navigation styled as a code editor, fixed at the bottom of the screen.
// Large screens: the tab bar, one .jsx file per section (the open tab is where you are),
// followed by the language as a JSX prop: <Site lang="pt" />.
// Small screens: only the open file shows; tapping it opens the file explorer with every section.
// `file` is the key of the section name in the translations (nav.*).
const SECTIONS = [
    { file: "home", top: true },
    { file: "about", id: "aboutMeContent" },
    { file: "experience", id: "professionalExperienceText" },
    { file: "projects", id: "projectsText" },
    { file: "certifications", id: "certificationsContent" },
    { file: "contact", id: "contactsText" },
];

// Syntax colours, same palette as the contact form
const C = { tag: "#f07178", attr: "#ffcb6b", str: "#c3e88d", pn: "#89ddff" };

const ReactIcon = () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#61DAFB" strokeWidth="1.4" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.6" fill="#61DAFB" stroke="none" />
    </svg>
);

// Which section is on screen: the last one whose top has passed 45% of the window
const useCurrentSection = () => {
    const [current, setCurrent] = useState(0);
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
    return current;
};

const goTo = (i) => {
    const s = SECTIONS[i];
    if (s.top) window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
};

const Divider = () => <span className="w-px my-1.5 bg-white/[0.18] shrink-0" aria-hidden="true" />;

// The language as a JSX prop; clicking the value swaps English and Portuguese.
// `short` keeps only the value, for small screens.
const LangProp = ({ short = false }) => {
    const { lang, setLang, t } = useLang();
    const value = (
        <button
            type="button"
            onClick={() => setLang(lang === "en" ? "pt" : "en")}
            aria-label={`${t.nav.language}: ${lang === "en" ? "English" : "Português"}`}
            className="rounded px-0.5 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#20C997]"
            style={{ color: C.str }}
        >
            "{lang}"
        </button>
    );
    if (short) return <span className="flex items-center px-3">{value}</span>;
    return (
        <span className="flex items-center px-3 whitespace-nowrap">
            <span style={{ color: C.pn }}>&lt;</span>
            <span style={{ color: C.tag }}>Site</span>
            <span className="ml-1.5" style={{ color: C.attr }}>
                lang
            </span>
            <span style={{ color: C.pn }}>=</span>
            {value}
            <span className="ml-1.5" style={{ color: C.pn }}>
                /&gt;
            </span>
        </span>
    );
};

const panel =
    "fixed z-40 left-1/2 -translate-x-1/2 max-w-[calc(100vw-32px)] rounded-xl border border-white/20 bg-[#0a0a0c]/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-mono";
const shell = `${panel} bottom-[max(16px,env(safe-area-inset-bottom))]`;

/* ---------- Large screens: the tab bar ---------- */

const TabBar = ({ current }) => {
    const { t } = useLang();
    return (
        <div className={`${shell} hidden lg:flex overflow-hidden text-[13px]`}>
            <nav aria-label={t.nav.label} className="flex">
                {SECTIONS.map((s, i) => {
                    const on = i === current;
                    return (
                        <button
                            key={s.file}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-current={on ? "page" : undefined}
                            className={`relative flex items-center gap-2 px-3.5 py-2.5 whitespace-nowrap border-r border-white/[0.08] transition-colors ${
                                on ? "bg-white/[0.07] text-white" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                            }`}
                        >
                            {on && <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#20C997]" />}
                            <ReactIcon />
                            <span>
                                {t.nav[s.file]}
                                <span className="hidden xl:inline text-gray-500">.jsx</span>
                            </span>
                        </button>
                    );
                })}
            </nav>
            <Divider />
            <LangProp />
        </div>
    );
};

/* ---------- Small screens: the open file and the explorer ---------- */

const Explorer = ({ current }) => {
    const { t } = useLang();
    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);

    // Close on Escape or a tap outside
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        const onDown = (e) => !boxRef.current?.contains(e.target) && setOpen(false);
        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onDown);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onDown);
        };
    }, [open]);

    return (
        <div ref={boxRef} className="lg:hidden">
            {open && (
                <div
                    id="nav-explorer"
                    className={`${panel} bottom-[calc(max(16px,env(safe-area-inset-bottom))+52px)] w-[min(320px,calc(100vw-32px))] py-2 text-[13px] text-gray-400`}
                >
                    <p className="px-4 py-1.5 text-gray-500">▾ src / sections</p>
                    <nav aria-label={t.nav.label}>
                        {SECTIONS.map((s, i) => {
                            const on = i === current;
                            return (
                                <button
                                    key={s.file}
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        goTo(i);
                                    }}
                                    aria-current={on ? "page" : undefined}
                                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left ${
                                        on ? "bg-white/[0.06] text-white" : "hover:bg-white/[0.03] hover:text-gray-200"
                                    }`}
                                >
                                    <ReactIcon />
                                    {t.nav[s.file]}.jsx
                                </button>
                            );
                        })}
                    </nav>
                </div>
            )}

            <div className={`${shell} flex overflow-hidden text-[13px]`}>
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-expanded={open}
                    aria-controls="nav-explorer"
                    className="relative flex items-center gap-2 px-4 py-2.5 whitespace-nowrap text-white"
                >
                    <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#20C997]" />
                    <ReactIcon />
                    <span>
                        {t.nav[SECTIONS[current].file]}
                        <span className="text-gray-500">.jsx</span>
                    </span>
                    <span className="text-gray-500" aria-hidden="true">
                        {open ? "▾" : "▴"}
                    </span>
                </button>
                <Divider />
                <LangProp short />
            </div>
        </div>
    );
};

const EditorNav = () => {
    const current = useCurrentSection();
    return (
        <>
            <TabBar current={current} />
            <Explorer current={current} />
        </>
    );
};

export default EditorNav;
