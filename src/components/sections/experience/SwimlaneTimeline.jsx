import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion, useMotionValueEvent } from "framer-motion";
import CarouselControls from "../../ui/CarouselControls";
import { useLang } from "../../../i18n/LanguageContext";
import { localizeRole } from "../../../i18n/data";
import TimelineItem from "./TimelineItem";
import {
    roles,
    years,
    slots,
    N,
    eventsIn,
    firstSlotOf,
    roleSpan,
    lastYear,
    COL_W,
    HEADER_H,
    LABEL_W,
    LINE_Y,
    CARD_TOP,
    ITEM_X,
    DATE_COL,
    LANE_PAD,
    NAV_SPACE,
    CONTROLS_H,
    laneTops,
} from "./timeline";

// Each lane is as tall as its tallest moment, so every text shows in full.
// If the three lanes don't fit the window, the whole timeline is scaled down to fit.
const useLaneLayout = (boxRef, lang) => {
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
    }, [boxRef, lang]);

    return { heights, fit };
};

/* ---------- Desktop: swimlanes, scroll-driven horizontally ---------- */

// Year label above its column(s); it fills in white while one of its columns is active.
const YearHeader = ({ year, active, onSelect }) => {
    const { t } = useLang();
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
            aria-label={`${t.experience.goTo} ${year}`}
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
    const cardOpacity = useTransform(dist, [0, 1, 2], [1, 0.5, 0.2]);
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
const STEP_VH = 32;
const OUTRO_VH = 10;
const SCROLL_VH = INTRO_VH + (N - 1) * STEP_VH + OUTRO_VH;

const SwimlaneTimeline = () => {
    const { lang, t } = useLang();
    const wrapRef = useRef(null);
    const reduceMotion = useReducedMotion();
    const boxRef = useRef(null);
    const { heights, fit } = useLaneLayout(boxRef, lang);
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
            <motion.div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center gap-6 pt-4" style={{ paddingBottom: NAV_SPACE }}>
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
                                <SlotColumn key={`${slot.year}-${slot.sub}`} slot={slot} index={i} active={active} onSelect={scrollToIndex} heights={heights} />
                            ))}
                        </motion.div>
                    </div>

                    {/* Fixed lane labels over a fade */}
                    <div
                        className="absolute top-0 left-0 bottom-0 z-20 pointer-events-none"
                        style={{ width: LABEL_W + 320, background: "linear-gradient(90deg, #000 70%, rgba(0,0,0,0))" }}
                    >
                        {roles
                            .map((r) => localizeRole(r, lang))
                            .map((role, i) => (
                                <div key={role.id} className="absolute left-10 flex items-start gap-4" style={{ top: tops[i] + 14, width: LABEL_W + 120 }}>
                                    {/* Outlined lane number, like the 01 / 02 / 03 in Projects */}
                                    <span
                                        className="font-syncopate text-6xl sm:text-7xl leading-none text-transparent shrink-0 w-[118px]"
                                        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.22)" }}
                                    >
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div className="min-w-0 w-[230px] border-l pl-4" style={{ borderColor: `${role.color}55` }}>
                                        <p
                                            className="flex items-center gap-2 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]"
                                            style={{ color: role.color }}
                                        >
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
                <CarouselControls
                    count={N}
                    active={current}
                    onPrev={() => scrollToIndex(Math.max(0, current - 1))}
                    onNext={() => scrollToIndex(Math.min(N - 1, current + 1))}
                    onSelect={scrollToIndex}
                    prevLabel={t.carousel.previous}
                    nextLabel={t.carousel.next}
                    dotLabel={(i) => `${t.experience.goTo} ${slots[i].year}${slots[i].sub ? ` (${slots[i].sub + 1})` : ""}`}
                />
            </motion.div>
        </div>
    );
};

export default SwimlaneTimeline;
