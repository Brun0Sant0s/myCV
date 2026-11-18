import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiChevronDown, FiDownload, FiFilm, FiMic } from "react-icons/fi";
import { GiWeightLiftingUp, GiRunningShoe, GiTennisRacket, GiSoccerBall } from "react-icons/gi";
import profilePic from "../../assets/profilePic.jpg";
import { projectMarks } from "../../assets/projects";
import { ACCENT, EASE } from "../../constants/theme";
import useReveal from "../../hooks/useReveal";
import TechBadge from "../ui/TechBadge";
import CarouselControls from "../ui/CarouselControls";
import useAutoplay from "../../hooks/useAutoplay";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useLang } from "../../i18n/LanguageContext";

// Core stack shown as icons, like the technologies on each project
const STACK = ["React", "TypeScript", "JavaScript", "Expo", "Angular", "Node.js", "Firebase", "HTML", "CSS"];

const Point = ({ text }) => {
    const i = text.indexOf(":");
    return (
        <li className="relative pl-4 font-montserrat font-light text-sm lg:text-[15px] text-gray-300 leading-relaxed">
            <span className="absolute left-0 top-[9px] w-[5px] h-[5px] rounded-full" style={{ background: ACCENT }} />
            <span className="font-semibold text-white">{text.slice(0, i)}</span>
            {text.slice(i)}
        </li>
    );
};

/* ---------- Centre: a deck of cards, like the project phones ---------- */

const ICON_TILE = "flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.08]";

const CardShell = ({ children }) => (
    <div className="w-full h-full rounded-[28px] bg-[#0c0c0c] border border-white/15 p-6 flex flex-col justify-between text-left lg:shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        {children}
    </div>
);

const CardText = ({ big, title, text }) => (
    <div>
        <p className="font-syncopate text-5xl leading-none" style={{ color: ACCENT }}>
            {big}
        </p>
        <p className="mt-4 font-montserrat font-semibold text-lg text-white">{title}</p>
        <p className="mt-1.5 font-montserrat font-light text-sm text-gray-400 leading-relaxed">{text}</p>
    </div>
);

const CARDS = [
    {
        id: "photo",
        render: () => (
            <img
                src={profilePic}
                alt="Bruno Santos"
                draggable={false}
                loading="lazy"
                decoding="async"
                className="block w-full h-full rounded-[28px] object-cover object-top select-none lg:shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            />
        ),
    },
    {
        id: "epharma",
        render: (t) => (
            <CardShell>
                <div className="flex flex-wrap gap-2">
                    {["JavaScript", "JQuery", "Angular", "HTML", "CSS", "Java"].map((t) => (
                        <TechBadge key={t} name={t} size="lg" />
                    ))}
                </div>
                <CardText big="4" {...t.about.cards.epharma} />
            </CardShell>
        ),
    },
    {
        id: "products",
        render: (t) => (
            <CardShell>
                <div className="flex gap-2.5">
                    {["savespot", "kyuar", "mingle"].map((k) => (
                        <span key={k} className="flex items-center justify-center w-14 h-14">
                            <img src={projectMarks[k]} alt={k} loading="lazy" className="max-w-full max-h-full object-contain" />
                        </span>
                    ))}
                </div>
                <CardText big="3" {...t.about.cards.products} />
            </CardShell>
        ),
    },
    {
        id: "offscreen",
        render: (t) => (
            <CardShell>
                <div className="flex flex-wrap gap-2">
                    {[GiWeightLiftingUp, GiRunningShoe, GiTennisRacket, GiSoccerBall, FiFilm, FiMic].map((Icon, i) => (
                        <span key={i} className={ICON_TILE}>
                            <Icon className="w-5 h-5 text-gray-200" aria-hidden="true" />
                        </span>
                    ))}
                </div>
                <CardText big="∞" {...t.about.cards.offscreen} />
            </CardShell>
        ),
    },
];

const CARD_W = 270;

const Deck = () => {
    const { t } = useLang();
    const reduceMotion = useReducedMotion();
    const [active, setActive] = useState(0);
    const n = CARDS.length;
    const go = (s) => setActive((a) => (a + s + n) % n);
    const ref = useRef(null);
    useAutoplay(ref, () => go(1), active);

    const place = (i) => {
        const d = (i - active + n) % n;
        if (d === 0) return { x: 0, rotate: 0, scale: 1, opacity: 1, zIndex: 3 };
        if (d === 1) return { x: 130, rotate: 7, scale: 0.84, opacity: 0.4, zIndex: 2 };
        if (d === n - 1) return { x: -130, rotate: -7, scale: 0.84, opacity: 0.4, zIndex: 2 };
        return { x: 0, rotate: 0, scale: 0.7, opacity: 0, zIndex: 1 };
    };

    return (
        <div
            ref={ref}
            className="flex flex-col gap-6 outline-none"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={t.about.deckLabel}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(1);
                if (e.key === "ArrowLeft") go(-1);
            }}
        >
            <div className="relative h-[380px] sm:h-[460px] md:max-lg:[mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] flex items-center justify-center">
                {CARDS.map((c, i) => {
                    const p = place(i);
                    const front = i === active;
                    return (
                        <motion.div
                            key={c.id}
                            className={`absolute aspect-[4/5] ${front ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
                            style={{ width: CARD_W, zIndex: p.zIndex }}
                            animate={{ x: p.x, rotate: p.rotate, scale: p.scale, opacity: p.opacity }}
                            transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                            onClick={() => !front && setActive(i)}
                            drag={front ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.25}
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -60) go(1);
                                else if (info.offset.x > 60) go(-1);
                            }}
                            aria-hidden={!front}
                        >
                            {c.render(t)}
                        </motion.div>
                    );
                })}
            </div>

            <CarouselControls
                count={CARDS.length}
                active={active}
                onPrev={() => go(-1)}
                onNext={() => go(1)}
                onSelect={setActive}
                dotLabel={(i) => `${t.about.card} ${i + 1}`}
                prevLabel={t.about.prevCard}
                nextLabel={t.about.nextCard}
            />
        </div>
    );
};

// Same layout as each project: who on the left, the photo on the centre stage, the details on the right.
// Phones: the cards come right after the bio (they are the most visual part), and the details table stays folded until asked for.
const About = () => {
    const { t } = useLang();
    const reveal = useReveal();
    const isPhone = !useMediaQuery("(min-width: 768px)");
    const [more, setMore] = useState(false);

    const facts = (
        <dl className="mt-10 md:mt-0 lg:mt-10 border-t border-white/10">
            {t.about.facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[96px_1fr] sm:grid-cols-[110px_1fr] gap-4 py-4 border-b border-white/10 items-start">
                    <dt className="pt-[2px] font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                        {f.label}
                    </dt>
                    <dd className="m-0 flex flex-col gap-1.5">
                        {f.items.some((it) => it.n) ? (
                            f.items.map((it) => (
                                <span key={it.v} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 font-montserrat text-sm text-white">
                                    {it.v}
                                    <span className="font-light text-gray-400 whitespace-nowrap">{it.n}</span>
                                </span>
                            ))
                        ) : (
                            <span className="font-montserrat text-sm text-white">{f.items.map((it) => it.v).join(", ")}</span>
                        )}
                    </dd>
                </div>
            ))}
        </dl>
    );

    return (
        <div id="aboutMeContent" className="relative w-full bg-black text-white px-5 sm:px-8 py-16 sm:py-24">
            <div className="mx-auto w-full max-w-[1400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_420px_minmax(0,1fr)] gap-y-12 md:gap-x-10 lg:gap-x-28 items-center">
                    {/* Left: who I am */}
                    <motion.div className="text-left lg:text-right flex flex-col lg:items-end" {...reveal(0.05)}>
                        <h3 className="font-montserrat font-semibold text-3xl sm:text-4xl text-white leading-tight">Bruno Santos</h3>
                        <p className="mt-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                            {t.about.tagline}
                        </p>
                        <p className="mt-5 max-w-md font-montserrat font-light text-[15px] text-gray-400 leading-relaxed">{t.about.bio}</p>
                        {isPhone && (
                            <div className="mt-10">
                                <Deck />
                            </div>
                        )}
                        <div className="mt-6 flex flex-wrap lg:justify-end items-center gap-1.5">
                            {STACK.map((t) => (
                                <TechBadge key={t} name={t} size="lg" />
                            ))}
                        </div>
                        <a
                            href={`${import.meta.env.BASE_URL}documents/${t.about.cv}?v=${import.meta.env.VITE_CV_VERSION}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tap mt-7 lg:mt-6 w-full md:w-auto md:self-start lg:self-end inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 lg:px-4 lg:py-2 font-montserrat text-sm font-medium text-black hover:opacity-85"
                        >
                            <FiDownload className="w-4 h-4" />
                            {t.about.downloadCv}
                        </a>
                    </motion.div>

                    {/* Centre: deck of cards */}
                    {!isPhone && (
                        <motion.div className="min-w-0" {...reveal(0.1)}>
                            <Deck />
                        </motion.div>
                    )}

                    {/* Right: skills and details */}
                    <motion.div className="md:col-span-2 lg:col-span-1 md:grid md:grid-cols-2 md:gap-x-12 lg:block" {...reveal(0.15)}>
                        <div>
                            <p className="mb-5 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">{t.about.skillsTitle}</p>
                            <ul className="space-y-4">
                                {t.about.skills.map((s) => (
                                    <Point key={s} text={s} />
                                ))}
                            </ul>
                        </div>
                        {isPhone ? (
                            <div className="mt-8">
                                <button
                                    type="button"
                                    onClick={() => setMore((v) => !v)}
                                    aria-expanded={more}
                                    aria-controls="about-facts"
                                    className="tap inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 font-montserrat text-sm text-white"
                                >
                                    {more ? t.about.less : t.about.more}
                                    <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${more ? "rotate-180" : ""}`} aria-hidden="true" />
                                </button>
                                <div
                                    id="about-facts"
                                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                                        more ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                    }`}
                                    inert={!more}
                                >
                                    <div className="overflow-hidden">{facts}</div>
                                </div>
                            </div>
                        ) : (
                            facts
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
