import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion, useMotionValueEvent } from "framer-motion";
import { FiArrowUpRight, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import data from "../json/experience.json";
import { projectMarks } from "../assets/projects";
import TechBadge from "./TechBadge";

const EASE = [0.22, 1, 0.36, 1];
const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

// Chronological value of an event: "Aug 2021" → 2021.58; year-only dates go after dated ones in that year
const timeOf = (ev) => {
    const month = MONTHS[ev.date.slice(0, 3)];
    return Number(ev.year) + (month === undefined ? 0.95 : month / 12);
};

const roles = data.roles;
const roleById = Object.fromEntries(roles.map((r) => [r.id, r]));
const events = [...data.events].sort((a, b) => timeOf(a) - timeOf(b));

// Year columns, from the first to the last event
const firstYear = Number(events[0].year);
const lastYear = Number(events[events.length - 1].year);
const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => String(firstYear + i));

// A year normally takes one column. When two moments share a year in the same lane
// (2026: OurUber and Mingle), that year gets one column per moment so every text is shown in full.
const eventsIn = (roleId, year) => events.filter((e) => e.role === roleId && e.year === year);
const slots = years.flatMap((year) => {
    const count = Math.max(1, ...roles.map((r) => eventsIn(r.id, year).length));
    return Array.from({ length: count }, (_, sub) => ({ year, sub, last: sub === count - 1 }));
});
const N = slots.length;
const firstSlotOf = (year) => slots.findIndex((s) => s.year === year);

// Years a role was active, for the lane line
const roleSpan = {
    epharma: [2021, 2025],
    freelance: [2021, lastYear],
    pyro: [2024, lastYear],
};

// Desktop layout
const COL_W = 420;
const HEADER_H = 84;
const LABEL_W = 250;
const LINE_Y = 30; // lane line distance from the top of the lane
const CARD_TOP = 50; // card distance from the top of the lane
const ITEM_X = 24; // horizontal inset of a moment inside its year column

// Month of a moment ("Jun 2024" → "Jun"); year-only moments have none, since the year is already shown above.
const monthOf = (ev) => {
    const first = ev.date.split(" ")[0];
    return MONTHS[first] !== undefined ? first : "";
};


// Option C: the date leads in large type, a thin rule, then the text.
const DATE_COL = 56;

const TimelineItem = ({ ev, color }) => {
    const month = monthOf(ev);
    const mark = ev.logo && projectMarks[ev.logo];
    return (
        <div className="grid text-left" style={{ gridTemplateColumns: `${DATE_COL}px 1fr`, columnGap: 16 }}>
            <div className="pt-0.5">
                {month && (
                    <p className="font-syncopate text-lg leading-none" style={{ color }}>
                        {month}
                    </p>
                )}
            </div>

            <div className="min-w-0 border-l border-white/10 pl-4">
                <div className="flex items-center gap-2.5">
                    {mark && (
                        <span
                            className="flex items-center justify-center w-9 h-9 shrink-0"
                        >
                            <img src={mark} alt="" className="max-w-full max-h-full object-contain" />
                        </span>
                    )}
                    <h4 className="font-montserrat font-semibold text-white text-lg leading-snug">{ev.title}</h4>
                    {ev.status && (
                        <span className="font-montserrat text-[10px] text-gray-300 bg-white/[0.07] rounded-full px-2.5 py-0.5 whitespace-nowrap">
                            {ev.status}
                        </span>
                    )}
                </div>
                <p className="mt-2.5 font-montserrat font-light text-sm text-gray-400 leading-relaxed">{ev.text}</p>
                {(ev.technologies.length > 0 || ev.link) && (
                    <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                            {ev.technologies.map((tech) => (
                                <TechBadge key={tech} name={tech} size="lg" />
                            ))}
                        </div>
                        {ev.link && (
                            <a
                                href={ev.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-montserrat text-xs font-medium text-black whitespace-nowrap transition-opacity duration-300 hover:opacity-85"
                            >
                                {ev.linkLabel}
                                <FiArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const useIsDesktop = () => {
    const query = "(min-width: 1024px)";
    const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
    useEffect(() => {
        const mq = window.matchMedia(query);
        const onChange = () => setIsDesktop(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return isDesktop;
};

// Each lane is as tall as its tallest moment, so every text shows in full.
// If the three lanes don't fit the window, the whole timeline is scaled down to fit.
const LANE_PAD = 28; // space under the tallest moment of a lane
// Vertical room the timeline can't use: the arrows and dots, plus the fixed tab bar at the bottom of the screen
const NAV_SPACE = 84;
const CONTROLS_H = NAV_SPACE + 16 + 24 + 36 + 12;

const useLaneLayout = (boxRef) => {
    const [heights, setHeights] = useState(() => roles.map(() => 240));
    const [fit, setFit] = useState(1);

    useLayoutEffect(() => {
        const measure = () => {
            const box = boxRef.current;
            if (!box) return;
            const next = roles.map((_, i) => {
                const cards = box.querySelectorAll(`[data-lane="${i}"]`);
                const tallest = Math.max(0, ...[...cards].map((c) => c.offsetHeight));
                return Math.max(170, CARD_TOP + tallest + LANE_PAD);
            });
            setHeights((prev) => (prev.every((h, i) => h === next[i]) ? prev : next));
            const total = HEADER_H + next.reduce((sum, h) => sum + h, 0);
            setFit(Math.min(1, (window.innerHeight - CONTROLS_H) / total));
        };
        measure();
        document.fonts?.ready.then(measure);
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [boxRef]);

    return { heights, fit };
};

// Top of each lane, below the year row
const laneTops = (heights) => heights.map((_, i) => HEADER_H + heights.slice(0, i).reduce((sum, h) => sum + h, 0));

/* ---------- Desktop: swimlanes, scroll-driven horizontally ---------- */

// Year label above its column(s); it fills in white while one of its columns is active.
const YearHeader = ({ year, active, onSelect }) => {
    const from = firstSlotOf(year);
    const span = slots.filter((s) => s.year === year).length;
    const dist = useTransform(active, (a) => {
        const d = a < from ? from - a : a > from + span - 1 ? a - (from + span - 1) : 0;
        return Math.min(d, 2);
    });
    const scale = useTransform(dist, [0, 1], [1.15, 1]);
    // When a year has two columns, its label follows the active one
    const x = useTransform(active, (a) => Math.max(0, Math.min(span - 1, a - from)) * COL_W);
    const opacity = useTransform(dist, [0, 1, 2], [1, 0.6, 0.35]);
    const fill = useTransform(dist, [0, 0.6], [1, 0]);

    return (
        <motion.button
            type="button"
            onClick={() => onSelect(from)}
            aria-label={`Go to ${year}`}
            className="absolute top-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-full"
            style={{ left: from * COL_W, width: COL_W, height: HEADER_H, x }}
        >
            <motion.span className="relative font-syncopate text-3xl leading-none" style={{ scale, opacity }}>
                <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)" }}>
                    {year}
                </span>
                <motion.span className="absolute inset-0 text-white" style={{ opacity: fill }}>
                    {year}
                </motion.span>
            </motion.span>
        </motion.button>
    );
};

// One column of the track: the lane lines and at most one moment per lane.
const SlotColumn = ({ slot, index, active, onSelect, heights }) => {
    const dist = useTransform(active, (a) => Math.min(Math.abs(a - index), 2));
    const cardScale = useTransform(dist, [0, 1, 2], [1, 0.9, 0.84]);
    const cardOpacity = useTransform(dist, [0, 1, 2], [1, 0.3, 0.12]);
    const dotScale = useTransform(dist, [0, 1], [1.5, 1]);
    const y = Number(slot.year);
    const dotX = ITEM_X + DATE_COL / 2;

    return (
        <div className="absolute" style={{ top: HEADER_H, left: index * COL_W, width: COL_W }}>
            {roles.map((role, laneIndex) => {
                const [from, to] = roleSpan[role.id] || [0, 0];
                const isActive = y >= from && y <= to;
                const ev = eventsIn(role.id, slot.year)[slot.sub];
                const starts = y === from && slot.sub === 0;
                const ends = y === to && to < lastYear && slot.last;
                return (
                    <div key={role.id} className="relative" style={{ height: heights[laneIndex] }}>
                        {isActive && (
                            <span
                                className="absolute h-px"
                                style={{ top: LINE_Y, left: starts ? dotX : 0, right: ends ? COL_W - dotX : 0, background: `${role.color}59` }}
                            />
                        )}
                        {ev && (
                            <>
                                <motion.span
                                    className="absolute w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full"
                                    style={{ top: LINE_Y, left: dotX, background: role.color, boxShadow: "0 0 0 4px #000", scale: dotScale }}
                                />
                                <motion.div
                                    data-lane={laneIndex}
                                    className="absolute cursor-pointer origin-top-left"
                                    style={{ top: CARD_TOP, left: ITEM_X, right: ITEM_X, scale: cardScale, opacity: cardOpacity }}
                                    onClick={() => onSelect(index)}
                                >
                                    <TimelineItem ev={ev} color={role.color} />
                                </motion.div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// Scroll distances, in vh, of the pinned scene:
// INTRO is a short hold on the first year once pinned, STEP_VH moves one year,
// OUTRO is a short hold on the last year before the page continues. No fades.
const INTRO_VH = 10;
const STEP_VH = 45;
const OUTRO_VH = 10;
const SCROLL_VH = INTRO_VH + (N - 1) * STEP_VH + OUTRO_VH;

const SwimlaneTimeline = () => {
    const wrapRef = useRef(null);
    const reduceMotion = useReducedMotion();
    const boxRef = useRef(null);
    const { heights, fit } = useLaneLayout(boxRef);
    const tops = laneTops(heights);
    const [current, setCurrent] = useState(0);

    const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
    // Scroll picks the year (rounded), and the track glides to it with a spring.
    // There is never a half-way resting state, and nothing fights the user's wheel.
    const stepTarget = useTransform(scrollYProgress, (v) => {
        const t = v * SCROLL_VH - INTRO_VH;
        return Math.max(0, Math.min(N - 1, Math.round(t / STEP_VH)));
    });
    const springActive = useSpring(stepTarget, { stiffness: 170, damping: 26, mass: 0.9 });
    const active = reduceMotion ? stepTarget : springActive;
    const x = useTransform(active, (a) => -a * COL_W);

    useMotionValueEvent(active, "change", (a) => setCurrent(Math.round(a)));

    const scrollToIndex = (i) => {
        const el = wrapRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const range = el.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + ((INTRO_VH + i * STEP_VH) / SCROLL_VH) * range, behavior: "smooth" });
    };

    const totalH = HEADER_H + heights.reduce((sum, h) => sum + h, 0);

    return (
        <div ref={wrapRef} className="relative w-full" style={{ height: `${100 + SCROLL_VH}vh` }}>
            <motion.div
                className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center gap-6 pt-4"
                style={{ paddingBottom: NAV_SPACE }}
            >
                <div
                    ref={boxRef}
                    className="relative w-full max-w-[1600px] mx-auto overflow-hidden origin-center"
                    style={{ height: totalH, transform: fit < 1 ? `scale(${fit})` : undefined, marginBlock: fit < 1 ? (totalH * (fit - 1)) / 2 : 0 }}
                >
                    {/* Dividers: one under the years, one between each lane */}
                    {roles.map((role, i) => (
                        <div
                            key={`divider-${role.id}`}
                            className="absolute left-0 right-0 h-px bg-white/[0.08] z-30 pointer-events-none"
                            style={{ top: tops[i] }}
                        />
                    ))}

                    {/* Track: the active year sits in the middle of the screen */}
                    <div className="absolute inset-y-0" style={{ left: `calc(50% - ${COL_W / 2}px)`, right: 0 }}>
                        <motion.div className="absolute inset-0" style={{ x }}>
                            {years.map((year) => (
                                <YearHeader key={year} year={year} active={active} onSelect={scrollToIndex} />
                            ))}
                            {slots.map((slot, i) => (
                                <SlotColumn
                                    key={`${slot.year}-${slot.sub}`}
                                    slot={slot}
                                    index={i}
                                    active={active}
                                    onSelect={scrollToIndex}
                                    heights={heights}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* Fixed lane labels over a fade */}
                    <div
                        className="absolute top-0 left-0 bottom-0 z-20 pointer-events-none"
                        style={{ width: LABEL_W + 320, background: "linear-gradient(90deg, #000 70%, rgba(0,0,0,0))" }}
                    >
                        {roles.map((role, i) => (
                            <div
                                key={role.id}
                                className="absolute left-10 flex items-start gap-4"
                                style={{ top: tops[i] + 14, width: LABEL_W + 120 }}
                            >
                                {/* Outlined lane number, like the 01 / 02 / 03 in Projects */}
                                <span
                                    className="font-syncopate text-6xl sm:text-7xl leading-none text-transparent shrink-0 w-[118px]"
                                    style={{ WebkitTextStroke: "1px rgba(255,255,255,0.22)" }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="min-w-0 w-[230px] border-l pl-4" style={{ borderColor: `${role.color}55` }}>
                                    <p className="flex items-center gap-2 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: role.color }}>
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: role.color }} />
                                        {role.label}
                                    </p>
                                    <p className="mt-2 font-montserrat font-semibold text-base text-white leading-snug">{role.role}</p>
                                    <p className="mt-1.5 inline-block font-montserrat text-[11px] text-gray-300 bg-white/[0.06] rounded-full px-2.5 py-0.5">
                                        {role.period}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right edge fade */}
                    <div
                        className="absolute top-0 right-0 bottom-0 w-40 z-10 pointer-events-none"
                        style={{ background: "linear-gradient(270deg, #000, rgba(0,0,0,0))" }}
                    />
                </div>

                {/* Arrows and dots, as in Projects and Certifications */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => scrollToIndex(Math.max(0, current - 1))}
                        aria-label="Previous"
                        className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/40"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1.5">
                        {slots.map((slot, i) => (
                            <button
                                key={`${slot.year}-${slot.sub}`}
                                type="button"
                                aria-label={`Go to ${slot.year}${slot.sub ? ` (${slot.sub + 1})` : ""}`}
                                onClick={() => scrollToIndex(i)}
                                className="h-1 rounded-full bg-white transition-all duration-300"
                                style={{ width: i === current ? 22 : 8, opacity: i === current ? 1 : 0.2 }}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => scrollToIndex(Math.min(N - 1, current + 1))}
                        aria-label="Next"
                        className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/40"
                    >
                        <FiArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

/* ---------- Mobile / tablet: vertical, chronological ---------- */

const VerticalTimeline = () => {
    const reduceMotion = useReducedMotion();

    return (
        <div className="w-full flex flex-col items-center px-5 sm:px-8 py-16 text-left">
            {/* Legend */}
            <div className="w-full max-w-xl flex flex-wrap gap-x-6 gap-y-2 mb-12 font-montserrat text-xs">
                {roles.map((r) => (
                    <span key={r.id} className="inline-flex items-center gap-2" style={{ color: r.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                        {r.label}
                    </span>
                ))}
            </div>

            <ol className="relative w-full max-w-xl border-l border-white/10 flex flex-col gap-10">
                {events.map((ev, i) => {
                    const role = roleById[ev.role];
                    const newYear = i === 0 || events[i - 1].year !== ev.year;
                    return (
                        <motion.li
                            key={ev.title}
                            className="relative pl-6"
                            {...(reduceMotion
                                ? {}
                                : {
                                      initial: { opacity: 0, y: 20 },
                                      whileInView: { opacity: 1, y: 0 },
                                      viewport: { once: true, amount: 0.3 },
                                      transition: { duration: 0.6, ease: EASE },
                                  })}
                        >
                            {newYear && <p className="font-syncopate text-3xl leading-none text-transparent mb-5" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)" }}>{ev.year}</p>}
                            <div className="relative">
                                <span
                                    className="absolute -left-6 top-[5px] -translate-x-1/2 w-2.5 h-2.5 rounded-full"
                                    style={{ background: role.color, boxShadow: "0 0 0 4px #000" }}
                                />
                                <p className="mb-3 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: role.color }}>
                                    {role.label}
                                </p>
                            </div>
                            <TimelineItem ev={ev} color={role.color} />
                        </motion.li>
                    );
                })}
            </ol>
        </div>
    );
};

const ProfessionalExperienceContent = () => {
    const isDesktop = useIsDesktop();

    return (
        <div id="professionalExperienceContent" className="relative w-full bg-black text-white">
            {isDesktop ? <SwimlaneTimeline /> : <VerticalTimeline />}
        </div>
    );
};

export default ProfessionalExperienceContent;
