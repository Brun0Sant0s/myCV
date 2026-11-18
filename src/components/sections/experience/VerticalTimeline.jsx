import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLang } from "../../../i18n/LanguageContext";
import { localizeRole } from "../../../i18n/data";
import { EASE } from "../../../constants/theme";
import TimelineItem from "./TimelineItem";
import { roles, roleById, events } from "./timeline";

/* ---------- Mobile / tablet: vertical, chronological ---------- */

// Filter chips, like a native segmented filter: all moments, or one lane only.
// They stick to the top of the screen while you scroll through the list.
const Filters = ({ value, onChange }) => {
    const { lang, t } = useLang();
    const options = [{ id: null, label: t.experience.all, color: "#ffffff" }, ...roles.map((r) => localizeRole(r, lang))];
    return (
        <div
            role="group"
            aria-label={t.experience.filter}
            className="sticky z-20 top-0 pt-[env(safe-area-inset-top)] self-stretch -mx-5 sm:-mx-8 mb-10 px-5 sm:px-8 py-3 bg-black/95"
        >
            <div className="mx-auto max-w-xl flex gap-2 overflow-x-auto no-scrollbar">
                {options.map((o) => {
                    const on = value === o.id;
                    return (
                        <button
                            key={o.id ?? "all"}
                            type="button"
                            onClick={() => onChange(o.id)}
                            aria-pressed={on}
                            className={`tap relative shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-full border font-montserrat text-[13px] font-medium whitespace-nowrap ${
                                on ? "border-transparent text-black" : "border-white/[0.14] text-gray-300 active:bg-white/[0.06]"
                            }`}
                        >
                            {on && (
                                <motion.span
                                    layoutId="timeline-filter"
                                    className="absolute inset-0 rounded-full bg-white"
                                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                                />
                            )}
                            {o.id && <span className="relative w-2 h-2 rounded-full" style={{ background: o.color }} />}
                            <span className="relative">{o.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const VerticalTimeline = () => {
    const { lang } = useLang();
    const reduceMotion = useReducedMotion();
    const [lane, setLane] = useState(null);
    const shown = lane ? events.filter((ev) => ev.role === lane) : events;
    const topRef = useRef(null);

    // A new filter starts from the top of the list if you had already scrolled into it
    const pick = (id) => {
        setLane(id);
        const top = topRef.current;
        if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    };

    return (
        <div className="w-full flex flex-col items-center px-5 sm:px-8 pt-6 pb-16 text-left">
            <span ref={topRef} aria-hidden="true" className="block h-0 scroll-mt-[env(safe-area-inset-top)]" />
            <Filters value={lane} onChange={pick} />

            <ol className="relative w-full max-w-xl border-l border-white/10 flex flex-col gap-10">
                <AnimatePresence initial={false} mode="popLayout">
                    {shown.map((ev, i) => {
                        const role = localizeRole(roleById[ev.role], lang);
                        const newYear = i === 0 || shown[i - 1].year !== ev.year;
                        return (
                            <motion.li
                                key={ev.id}
                                layout={!reduceMotion}
                                className="relative pl-6"
                                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
                                transition={{ duration: 0.45, ease: EASE }}
                            >
                                {newYear && (
                                    <p
                                        className="font-syncopate text-3xl leading-none text-transparent mb-5"
                                        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)" }}
                                    >
                                        {ev.year}
                                    </p>
                                )}
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
                </AnimatePresence>
            </ol>
        </div>
    );
};

export default VerticalTimeline;
