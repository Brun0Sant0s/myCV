import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiDownload, FiFilm, FiMic } from "react-icons/fi";
import { GiWeightLiftingUp, GiRunningShoe, GiTennisRacket, GiSoccerBall } from "react-icons/gi";
import profilePic from "../../assets/profilePic.jpg";
import { projectMarks } from "../../assets/projects";
import { ACCENT, EASE } from "../../constants/theme";
import TechBadge from "../ui/TechBadge";
import CarouselControls from "../ui/CarouselControls";
import useAutoplay from "../../hooks/useAutoplay";

// Core stack shown as icons, like the technologies on each project
const STACK = ["React", "TypeScript", "JavaScript", "Expo", "Angular", "Node.js", "Firebase", "HTML", "CSS"];

// Written like the project features: "Name: explanation"
const skills = [
    "Frontend: HTML5, CSS3, JavaScript, TypeScript, React, Angular and jQuery",
    "Mobile and backend: React Native with Expo, Node.js, Firebase, REST APIs, Java and SQL",
    "Design and tools: Figma, UI/UX, Git and Agile/Scrum",
    "Product: requirements, stakeholders, UX and end-to-end delivery",
];

// Each row: a label and a list of items, each item with an optional note (level, place, year)
const facts = [
    { label: "Education", items: [{ v: "BSc Computer Engineering", n: "IPB · 2027" }] },
    {
        label: "Languages",
        items: [
            { v: "Portuguese", n: "Native" },
            { v: "English", n: "Fluent" },
            { v: "Spanish", n: "Basic" },
        ],
    },
    { label: "Sports", items: [{ v: "Gym" }, { v: "Running" }, { v: "Padel" }, { v: "Football" }] },
    { label: "Also into", items: [{ v: "Films" }, { v: "Podcasts" }] },
];

const Point = ({ text }) => {
    const i = text.indexOf(":");
    return (
        <li className="relative pl-4 font-montserrat font-light text-sm text-gray-300 leading-relaxed">
            <span className="absolute left-0 top-[9px] w-[5px] h-[5px] rounded-full" style={{ background: ACCENT }} />
            <span className="font-semibold text-white">{text.slice(0, i)}</span>
            {text.slice(i)}
        </li>
    );
};

/* ---------- Centre: a deck of cards, like the project phones ---------- */

const ICON_TILE = "flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.08]";

const CardShell = ({ children }) => (
    <div className="w-full h-full rounded-[28px] bg-[#0c0c0c] border border-white/15 p-6 flex flex-col justify-between text-left shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
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
                className="block w-full h-full rounded-[28px] object-cover object-top select-none shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            />
        ),
    },
    {
        id: "epharma",
        render: () => (
            <CardShell>
                <div className="flex flex-wrap gap-2">
                    {["JavaScript", "JQuery", "Angular", "HTML", "CSS", "Java"].map((t) => (
                        <TechBadge key={t} name={t} size="lg" />
                    ))}
                </div>
                <CardText big="4" title="Years at ePharma" text="Production frontend in a Scrum team, from Figma to pixel-perfect." />
            </CardShell>
        ),
    },
    {
        id: "products",
        render: () => (
            <CardShell>
                <div className="flex gap-2.5">
                    {[
                        ["savespot", "#1FB6C9"],
                        ["kyuar", "#F97316"],
                        ["mingle", "#8A9A5B"],
                    ].map(([k, c]) => (
                        <span key={k} className="flex items-center justify-center w-14 h-14">
                            <img src={projectMarks[k]} alt={k} className="max-w-full max-h-full object-contain" />
                        </span>
                    ))}
                </div>
                <CardText big="3" title="Own products" text="SaveSpot, Kyuar and Mingle, taken from idea to launch. One is live on the App Store." />
            </CardShell>
        ),
    },
    {
        id: "offscreen",
        render: () => (
            <CardShell>
                <div className="flex flex-wrap gap-2">
                    {[GiWeightLiftingUp, GiRunningShoe, GiTennisRacket, GiSoccerBall, FiFilm, FiMic].map((Icon, i) => (
                        <span key={i} className={ICON_TILE}>
                            <Icon className="w-5 h-5 text-gray-200" aria-hidden="true" />
                        </span>
                    ))}
                </div>
                <CardText big="∞" title="Off screen" text="Gym, running, padel, football, films and podcasts." />
            </CardShell>
        ),
    },
];

const CARD_W = 270;

const Deck = () => {
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
            aria-label="About me"
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(1);
                if (e.key === "ArrowLeft") go(-1);
            }}
        >
            <div className="relative h-[400px] sm:h-[460px] flex items-center justify-center">
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
                            {c.render()}
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
                dotLabel={(i) => `Card ${i + 1}`}
                prevLabel="Previous card"
                nextLabel="Next card"
            />
        </div>
    );
};

// Same layout as each project: who on the left, the photo on the centre stage, the details on the right.
const About = () => {
    const reduceMotion = useReducedMotion();
    const reveal = (delay = 0) =>
        reduceMotion
            ? {}
            : {
                  initial: { opacity: 0, y: 32 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.2 },
                  transition: { duration: 0.7, ease: EASE, delay },
              };

    return (
        <div id="aboutMeContent" className="relative w-full bg-black text-white px-5 sm:px-8 py-16 sm:py-24">
            <div className="mx-auto w-full max-w-[1400px]">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px_minmax(0,1fr)] gap-y-12 lg:gap-x-28 items-center">
                    {/* Left: who I am */}
                    <motion.div className="text-left lg:text-right flex flex-col lg:items-end" {...reveal(0.05)}>
                        <h3 className="font-montserrat font-semibold text-3xl sm:text-4xl text-white leading-tight">Bruno Santos</h3>
                        <p className="mt-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                            Frontend Engineer · Porto, Portugal
                        </p>
                        <p className="mt-5 max-w-md font-montserrat font-light text-[15px] text-gray-400 leading-relaxed">
                            Four years of production frontend at ePharma, and my own products taken from idea to launch, one of them
                            live on the App Store and Google Play. I like to understand the problem before writing code: the user,
                            the business and how every part of the product connects.
                        </p>
                        <div className="mt-6 flex flex-wrap lg:justify-end items-center gap-1.5">
                            {STACK.map((t) => (
                                <TechBadge key={t} name={t} size="lg" />
                            ))}
                        </div>
                        <a
                            href={`${import.meta.env.BASE_URL}documents/CV_BRUNO_EN.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-montserrat text-sm font-medium text-black transition-opacity duration-300 hover:opacity-85"
                        >
                            <FiDownload className="w-4 h-4" />
                            Download CV
                        </a>
                    </motion.div>

                    {/* Centre: deck of cards */}
                    <motion.div className="min-w-0" {...reveal(0.1)}>
                        <Deck />
                    </motion.div>

                    {/* Right: skills and details */}
                    <motion.div {...reveal(0.15)}>
                        <p className="mb-5 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">Skills</p>
                        <ul className="space-y-4">
                            {skills.map((s) => (
                                <Point key={s} text={s} />
                            ))}
                        </ul>
                        <dl className="mt-10 border-t border-white/10">
                            {facts.map((f) => (
                                <div key={f.label} className="grid grid-cols-[110px_1fr] gap-4 py-4 border-b border-white/10 items-start">
                                    <dt className="pt-[2px] font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                                        {f.label}
                                    </dt>
                                    <dd className="m-0 flex flex-col gap-1.5">
                                        {f.items.some((it) => it.n) ? (
                                            f.items.map((it) => (
                                                <span key={it.v} className="flex justify-between gap-4 font-montserrat text-sm text-white">
                                                    {it.v}
                                                    <span className="font-light text-gray-500 whitespace-nowrap">{it.n}</span>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="font-montserrat text-sm text-white">{f.items.map((it) => it.v).join(", ")}</span>
                                        )}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
