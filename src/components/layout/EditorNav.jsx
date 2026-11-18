import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FiAward, FiClock, FiLayers, FiMessageCircle, FiUser } from "react-icons/fi";
import { useLang } from "../../i18n/LanguageContext";

// Navigation styled as a code editor, fixed at the bottom of the screen.
// Large screens: the tab bar, one .jsx file per section (the open tab is where you are),
// followed by the language as a JSX prop: <Site lang="pt" />.
// Phones and tablets: a native app shell instead, a frosted top bar (section title + language) and a bottom tab bar.
// `file` is the key of the section name in the translations (nav.*).
const SECTIONS = [
    { file: "home", top: true },
    { file: "about", id: "aboutMeContent" },
    { file: "experience", id: "professionalExperienceText", title: true },
    { file: "projects", id: "projectsText", title: true },
    { file: "certifications", id: "certificationsText", title: true },
    { file: "contact", id: "contactsText", title: true },
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
    // Big section titles land in the middle of the screen, the rest at the top
    else document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: s.title ? "center" : "start" });
};

const SPRING = { type: "spring", stiffness: 500, damping: 38 };

const Divider = () => <span className="w-px my-1.5 bg-white/[0.18] shrink-0" aria-hidden="true" />;

// The language as a JSX prop; clicking the value swaps English and Portuguese.
const LangProp = () => {
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

/* ---------- Phones and tablets: native app chrome ---------- */

// Tab bar icons, one per section (the hero has none: the app bar takes you back there)
const TAB_ICONS = { about: FiUser, experience: FiClock, projects: FiLayers, certifications: FiAward, contact: FiMessageCircle };

// Language as an iOS-style segmented control; the pill slides to the chosen language
const LangSwitch = () => {
    const { lang, setLang, t } = useLang();
    return (
        <div role="group" aria-label={t.nav.language} className="relative flex p-0.5 rounded-full bg-white/[0.08] border border-white/10">
            {["pt", "en"].map((l) => {
                const on = l === lang;
                return (
                    <button
                        key={l}
                        type="button"
                        onClick={() => setLang(l)}
                        aria-pressed={on}
                        aria-label={l === "en" ? "English" : "Português"}
                        className={`tap relative z-10 h-8 min-w-[40px] px-2.5 rounded-full font-montserrat text-[11px] font-semibold uppercase tracking-wider ${
                            on ? "text-black" : "text-gray-400"
                        }`}
                    >
                        {on && <motion.span layoutId="lang-pill" className="absolute inset-0 -z-10 rounded-full bg-white" transition={SPRING} />}
                        {l}
                    </button>
                );
            })}
        </div>
    );
};

// Top app bar. Over the hero it is see-through and shows only the language;
// once the hero scrolls away it turns to frosted glass and names the section you are in,
// like an iOS large title collapsing into the bar. Tapping the name goes back to the top.
const AppBar = ({ current }) => {
    const { t } = useLang();
    const { scrollY } = useScroll();
    const [solid, setSolid] = useState(false);
    useMotionValueEvent(scrollY, "change", (y) => setSolid(y > window.innerHeight * 0.55));
    const title = current === 0 ? "Bruno Santos" : t.nav[SECTIONS[current].file];

    return (
        <header
            className={`lg:hidden fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] border-b transition-colors duration-300 ${
                solid ? "bg-black/70 backdrop-blur-xl backdrop-saturate-150 border-white/[0.08]" : "bg-transparent border-transparent"
            }`}
        >
            <div className="h-14 flex items-center justify-between gap-3 pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))]">
                <button
                    type="button"
                    onClick={() => goTo(0)}
                    aria-label={t.nav.backToTop}
                    tabIndex={solid ? 0 : -1}
                    aria-hidden={!solid}
                    className={`tap flex items-center gap-2.5 min-w-0 h-11 -ml-1 pl-1 pr-3 rounded-full transition-opacity duration-300 ${
                        solid ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                    <img
                        src={`${import.meta.env.BASE_URL}icon-192.png`}
                        alt=""
                        width="32"
                        height="32"
                        loading="lazy"
                        className="w-8 h-8 rounded-full shrink-0 ring-1 ring-white/15"
                    />
                    <span className="relative h-5 min-w-0 overflow-hidden text-left">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={title}
                                className="block font-montserrat font-semibold text-[15px] leading-5 text-white truncate"
                                initial={{ y: 14, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -14, opacity: 0 }}
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {title}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                </button>
                <LangSwitch />
            </div>
        </header>
    );
};

// Bottom tab bar: floating frosted glass, an icon and a short label per section.
// The active tab turns green and a soft pill slides under it.
const AppTabBar = ({ current }) => {
    const { t } = useLang();
    return (
        <nav
            aria-label={t.nav.label}
            className="lg:hidden fixed z-40 left-1/2 -translate-x-1/2 bottom-[max(12px,env(safe-area-inset-bottom))] w-[min(460px,calc(100vw-24px))] rounded-[28px] border border-white/[0.12] bg-[#0d0d10]/75 backdrop-blur-xl backdrop-saturate-150 shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-1.5"
        >
            <ul className="grid grid-cols-5">
                {SECTIONS.map((s, i) => {
                    if (s.top) return null;
                    const Icon = TAB_ICONS[s.file];
                    const on = i === current;
                    return (
                        <li key={s.file}>
                            <button
                                type="button"
                                onClick={() => goTo(i)}
                                aria-current={on ? "page" : undefined}
                                aria-label={t.nav[s.file]}
                                className={`tap relative w-full h-[52px] flex flex-col items-center justify-center gap-1 rounded-[22px] ${
                                    on ? "text-[#20C997]" : "text-gray-400"
                                }`}
                            >
                                {on && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-[22px] bg-white/[0.08]" transition={SPRING} />}
                                <Icon className="relative w-5 h-5" strokeWidth={on ? 2.2 : 1.8} aria-hidden="true" />
                                <span className={`relative font-montserrat text-[10px] leading-none ${on ? "font-semibold" : "font-medium"}`}>
                                    {t.nav.tabs[s.file]}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

const EditorNav = () => {
    const current = useCurrentSection();
    return (
        <>
            <TabBar current={current} />
            <AppBar current={current} />
            <AppTabBar current={current} />
        </>
    );
};

export default EditorNav;
