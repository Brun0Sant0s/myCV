import { useEffect, useRef, useState } from "react";
import { useLang } from "../../i18n/LanguageContext";

// Navigation styled as a code editor, fixed at the bottom of the screen:
// the tab bar, one .jsx file per section (the open tab is where you are),
// followed by the language as a JSX prop: <Site lang="pt" />.
// Phones and tablets get the same bar; when the tabs don't fit they scroll sideways
// like editor tabs, and the open one always slides into view.
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

const Divider = () => <span className="w-px my-1.5 bg-white/[0.18] shrink-0" aria-hidden="true" />;

// The language as a JSX prop; clicking the value swaps English and Portuguese.
// Very small screens keep only lang="pt" so the tabs get the room.
const LangProp = () => {
    const { lang, setLang, t } = useLang();
    return (
        <span className="flex items-center shrink-0 px-2.5 sm:px-3 whitespace-nowrap">
            <span className="hidden sm:inline" style={{ color: C.pn }}>
                &lt;
            </span>
            <span className="hidden sm:inline" style={{ color: C.tag }}>
                Site
            </span>
            <span className="sm:ml-1.5" style={{ color: C.attr }}>
                lang
            </span>
            <span style={{ color: C.pn }}>=</span>
            <button
                type="button"
                onClick={() => setLang(lang === "en" ? "pt" : "en")}
                aria-label={`${t.nav.language}: ${lang === "en" ? "English" : "Português"}`}
                className="tap rounded px-0.5 py-2.5 [@media(pointer:coarse)]:py-3 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#20C997]"
                style={{ color: C.str }}
            >
                "{lang}"
            </button>
            <span className="hidden sm:inline ml-1.5" style={{ color: C.pn }}>
                /&gt;
            </span>
        </span>
    );
};

const TabBar = ({ current }) => {
    const { t } = useLang();
    const navRef = useRef(null);
    // More tabs hidden to the right: the edge fades out as a hint to swipe
    const [more, setMore] = useState(false);

    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return undefined;
        const check = () => setMore(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 4);
        check();
        nav.addEventListener("scroll", check, { passive: true });
        window.addEventListener("resize", check);
        return () => {
            nav.removeEventListener("scroll", check);
            window.removeEventListener("resize", check);
        };
    }, [t]);

    // Keep the open tab in view when the tabs scroll sideways (only moves the bar, never the page)
    useEffect(() => {
        const nav = navRef.current;
        const tab = nav?.children[current];
        if (!nav || !tab || nav.scrollWidth <= nav.clientWidth) return;
        nav.scrollTo({ left: tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    }, [current]);

    return (
        <div className="fixed z-40 left-1/2 -translate-x-1/2 bottom-[max(12px,env(safe-area-inset-bottom))] lg:bottom-[max(16px,env(safe-area-inset-bottom))] flex max-w-[calc(100vw-24px)] lg:max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-white/20 bg-[#0a0a0c]/95 lg:bg-[#0a0a0c]/90 lg:backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-mono text-[13px]">
            <nav
                ref={navRef}
                aria-label={t.nav.label}
                className={`flex min-w-0 overflow-x-auto no-scrollbar overscroll-x-contain ${more ? "[mask-image:linear-gradient(90deg,#000_85%,transparent)]" : ""}`}
            >
                {SECTIONS.map((s, i) => {
                    const on = i === current;
                    return (
                        <button
                            key={s.file}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-current={on ? "page" : undefined}
                            className={`relative shrink-0 flex items-center gap-2 px-3.5 py-2.5 [@media(pointer:coarse)]:py-3 whitespace-nowrap border-r border-white/[0.08] transition-colors ${
                                on ? "bg-white/[0.07] text-white" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] active:bg-white/[0.05]"
                            }`}
                        >
                            {on && <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#20C997]" />}
                            <ReactIcon />
                            <span>
                                {t.nav[s.file]}
                                <span className="lg:hidden xl:inline text-gray-500">.jsx</span>
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

const EditorNav = () => {
    const current = useCurrentSection();
    return <TabBar current={current} />;
};

export default EditorNav;
