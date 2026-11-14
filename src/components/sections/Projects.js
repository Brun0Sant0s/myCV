import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import projects from "../../data/projects.json";
import { projectMarks } from "../../assets/projects";
import { ACCENT, EASE } from "../../constants/theme";
import TechBadge from "../ui/TechBadge";
import CarouselControls from "../ui/CarouselControls";

// Every screenshot in the media folder, by file name ("kyuar-home" → its URL)
const mediaContext = require.context("../../assets/projects/media", false, /\.jpg$/);
const media = Object.fromEntries(mediaContext.keys().map((k) => [k.replace("./", "").replace(".jpg", ""), mediaContext(k)]));


/* ---------- Media: one slider; desktop screens in a browser window, mobile screens in an iPhone ---------- */

// Light text on dark bars, dark text on light bars
const isLight = (hex) => {
    const n = parseInt((hex || "#000000").slice(1), 16);
    return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 > 150;
};

// iOS status bar height relative to a 390×844 iPhone viewport (47pt of 844pt)
const STATUS_BAR_RATIO = 47 / 844;

// Every iPhone has the same size: a 390×844 screen plus the status bar.
// Screenshots of that size fill it exactly; others are fitted inside (never cropped) on their own background.
const SCREEN_W = 390;
const SCREEN_H = 844 * (1 + STATUS_BAR_RATIO);

const IPhone = ({ src, alt, bar, hasStatusBar }) => {
    const ink = isLight(bar) ? "#111" : "#fff";
    return (
        <div className="h-full inline-flex rounded-[46px] bg-[#0c0c0c] p-[9px] border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
            <div
                className="relative h-full rounded-[38px] overflow-hidden flex flex-col"
                style={{ aspectRatio: `${SCREEN_W} / ${SCREEN_H}`, background: bar || "#0b0b0b" }}
            >
                {!hasStatusBar && (
                    <div
                        className="relative shrink-0 flex items-center justify-between px-[9%] font-montserrat text-[12px] font-semibold"
                        style={{ height: `${(STATUS_BAR_RATIO / (1 + STATUS_BAR_RATIO)) * 100}%`, color: ink }}
                    >
                        <span>9:41</span>
                        <span className="flex items-center gap-1">
                            <span className="flex items-end gap-[2px]">
                                {[4, 6, 8, 10].map((bh) => (
                                    <span key={bh} className="w-[3px] rounded-sm" style={{ height: bh, background: ink }} />
                                ))}
                            </span>
                            <span className="ml-1 w-[22px] h-[11px] rounded-[3px] border p-[1px]" style={{ borderColor: ink }}>
                                <span className="block h-full w-[75%] rounded-[1px]" style={{ background: ink }} />
                            </span>
                        </span>
                        <span className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[32%] h-[60%] rounded-full bg-black" />
                    </div>
                )}
                <img
                    src={src}
                    alt={alt}
                    draggable={false}
                    className={`block w-full select-none ${hasStatusBar ? "h-full object-cover object-top" : "h-auto"}`}
                />
            </div>
        </div>
    );
};

const Browser = ({ src, alt, url }) => (
    <div className="w-full rounded-xl overflow-hidden border border-white/15 bg-[#0c0c0c] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1.5 px-4 h-8 border-b border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            {url && <span className="mx-auto pr-10 font-montserrat text-[11px] text-gray-500">{url}</span>}
        </div>
        <img src={src} alt={alt} draggable={false} className="block w-full aspect-[16/10] object-cover object-top select-none" />
    </div>
);

// Slider with the "centre stage" fan: the active screen in front, its neighbours tilted behind.
const Device = ({ project, it }) => {
    const alt = `${project.name}: ${it.group} · ${it.label}`;
    return it.kind === "phone" ? (
        <IPhone src={media[it.src]} alt={alt} bar={it.bar} hasStatusBar={it.statusBar} />
    ) : (
        <Browser src={media[it.src]} alt={alt} url={it.url} />
    );
};

const Slider = ({ project }) => {
    const items = project.media.items;
    const [[active, dir], setState] = useState([0, 0]);
    const reduceMotion = useReducedMotion();
    const n = items.length;
    const item = items[active];
    const go = (step) => setState(([a]) => [(a + step + n) % n, step]);
    const prev = items[(active - 1 + n) % n];
    const next = items[(active + 1) % n];

    const isPhone = item.kind === "phone";

    // Neighbours peek behind the active screen: phones fan out to the sides,
    // browser windows sit just behind it, slightly tilted.
    const side = (it, s) => {
        if (n < 2 || it.kind !== item.kind) return null;
        const label = `${s < 0 ? "Previous" : "Next"}: ${it.label}`;
        return isPhone ? (
            <button
                type="button"
                aria-label={label}
                onClick={() => go(s)}
                className="absolute top-1/2 h-[80%] opacity-40 hover:opacity-70 transition-opacity duration-300"
                style={{ left: "50%", transform: `translate(calc(-50% + ${s * 150}px), -50%) rotate(${s * 7}deg)` }}
            >
                <Device project={project} it={it} />
            </button>
        ) : (
            <button
                type="button"
                aria-label={label}
                onClick={() => go(s)}
                className="absolute inset-0 flex items-center opacity-30 hover:opacity-55 transition-opacity duration-300"
                style={{ transform: `translateX(${s * 7}%) rotate(${s * 2.5}deg) scale(0.88)` }}
            >
                <Device project={project} it={it} />
            </button>
        );
    };

    return (
        <div
            className="flex flex-col gap-5 outline-none"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={`${project.name} screens`}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(1);
                if (e.key === "ArrowLeft") go(-1);
            }}
        >
            <div
                className={`relative flex items-center justify-center ${isPhone ? "h-[460px] sm:h-[540px]" : "w-full aspect-[16/11.2]"}`}
            >
                {side(prev, -1)}
                {side(next, 1)}
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={item.src}
                        className="absolute inset-0 z-10 flex items-center justify-center cursor-grab active:cursor-grabbing"
                        initial={reduceMotion ? false : { opacity: 0, x: dir >= 0 ? 60 : -60, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={reduceMotion ? undefined : { opacity: 0, x: dir >= 0 ? -60 : 60, scale: 0.96 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.25}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -60) go(1);
                            else if (info.offset.x > 60) go(-1);
                        }}
                    >
                        <div className={isPhone ? "h-[96%]" : "w-full"}>
                            <Device project={project} it={item} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Caption, arrows and dots */}
            <div className="flex flex-col items-center gap-3">
                <CarouselControls
                    count={items.length}
                    active={active}
                    onPrev={() => go(-1)}
                    onNext={() => go(1)}
                    onSelect={(i) => setState([i, i > active ? 1 : -1])}
                    dotLabel={(i) => `${items[i].group} ${items[i].label}`}
                    prevLabel="Previous screen"
                    nextLabel="Next screen"
                />
            </div>
        </div>
    );
};

/* ---------- One project: editorial row with a centre stage ---------- */

const Feature = ({ text }) => {
    const i = text.indexOf(":");
    return (
        <li className="relative pl-4 font-montserrat font-light text-sm text-gray-300 leading-relaxed">
            <span className="absolute left-0 top-[9px] w-[5px] h-[5px] rounded-full" style={{ background: ACCENT }} />
            {i > 0 ? (
                <>
                    <span className="font-semibold text-white">{text.slice(0, i)}</span>
                    {text.slice(i)}
                </>
            ) : (
                text
            )}
        </li>
    );
};

const Project = ({ project, index }) => {
    const reduceMotion = useReducedMotion();
    const mark = project.logo && projectMarks[project.logo];
    // Web projects get a wider stage so their screens stay readable
    const isWeb = project.media.items[0]?.kind === "browser";
    const columns = isWeb
        ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,640px)_minmax(0,1fr)] lg:gap-x-16"
        : "lg:grid-cols-[minmax(0,1fr)_420px_minmax(0,1fr)] lg:gap-x-28";
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
        <article className="py-16 sm:py-24 border-t border-white/[0.08] first:border-t-0">
            {/* Outlined number, year and status */}
            <motion.div className="flex items-end gap-5 mb-10" {...reveal()}>
                <span
                    className="font-syncopate text-6xl sm:text-7xl leading-none text-transparent"
                    style={{ WebkitTextStroke: "1px rgba(255,255,255,0.22)" }}
                >
                    {String(index + 1).padStart(2, "0")}
                </span>
                <span className="pb-1.5 flex items-center gap-3">
                    <span className="font-syncopate text-lg leading-none" style={{ color: ACCENT }}>
                        {project.year}
                    </span>
                    <span className="font-montserrat text-[10px] text-gray-300 bg-white/[0.07] rounded-full px-2.5 py-0.5">
                        {project.status}
                    </span>
                </span>
            </motion.div>

            <div className={`grid grid-cols-1 ${columns} gap-y-12 items-center`}>
                {/* Left: what the product is */}
                <motion.div className="text-left lg:text-right flex flex-col lg:items-end" {...reveal(0.05)}>
                    {mark && (
                        <span
                            className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 shrink-0"
                        >
                            <img src={mark} alt={`${project.name} logo`} className="max-w-full max-h-full object-contain" />
                        </span>
                    )}
                    <h3 className="mt-6 font-montserrat font-semibold text-3xl sm:text-4xl text-white leading-tight">{project.name}</h3>
                    <p className="mt-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                        {project.subtitle}
                    </p>
                    <p className="mt-5 max-w-md font-montserrat font-light text-[15px] text-gray-400 leading-relaxed">
                        {project.description}
                    </p>
                    <div className="mt-6 flex flex-wrap lg:justify-end items-center gap-1.5">
                        {project.technologies.map((tech) => (
                            <TechBadge key={tech} name={tech} size="lg" />
                        ))}
                    </div>
                    <div className="mt-6 flex flex-wrap lg:justify-end gap-3">
                        {project.links?.map((l, i) => (
                            <a
                                key={l.url}
                                href={l.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 rounded-full px-4 py-2 font-montserrat text-sm transition-colors duration-300 ${
                                    i === 0 ? "bg-white text-black hover:bg-white/85" : "border border-white/20 text-white hover:border-white/50"
                                }`}
                            >
                                {l.label}
                                <FiArrowUpRight className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* Centre: the stage */}
                <motion.div className="min-w-0" {...reveal(0.1)}>
                    <Slider project={project} />
                </motion.div>

                {/* Right: what it does */}
                <motion.div {...reveal(0.15)}>
                    <p className="mb-5 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">Features</p>
                    <ul className="space-y-4">
                        {project.features.map((f) => (
                            <Feature key={f} text={f} />
                        ))}
                    </ul>
                </motion.div>
            </div>
        </article>
    );
};

const Projects = () => (
    <div id="projectsContent" className="relative w-full bg-black text-white px-5 sm:px-8 py-12 sm:py-20">
        <div className="mx-auto w-full max-w-[1400px]">
            {projects.map((project, index) => (
                <Project key={project.id} project={project} index={index} />
            ))}
        </div>
    </div>
);

export default Projects;
