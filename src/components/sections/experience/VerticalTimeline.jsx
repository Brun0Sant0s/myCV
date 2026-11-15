import { motion } from "framer-motion";
import { useLang } from "../../../i18n/LanguageContext";
import { localizeRole } from "../../../i18n/data";
import useReveal from "../../../hooks/useReveal";
import TimelineItem from "./TimelineItem";
import { roles, roleById, events } from "./timeline";

/* ---------- Mobile / tablet: vertical, chronological ---------- */

const VerticalTimeline = () => {
    const { lang } = useLang();
    const reveal = useReveal({ y: 20, amount: 0.3 });

    return (
        <div className="w-full flex flex-col items-center px-5 sm:px-8 py-16 text-left">
            {/* Legend */}
            <div className="w-full max-w-xl flex flex-wrap gap-x-6 gap-y-2 mb-12 font-montserrat text-xs">
                {roles
                    .map((r) => localizeRole(r, lang))
                    .map((r) => (
                        <span key={r.id} className="inline-flex items-center gap-2" style={{ color: r.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                            {r.label}
                        </span>
                    ))}
            </div>

            <ol className="relative w-full max-w-xl border-l border-white/10 flex flex-col gap-10">
                {events.map((ev, i) => {
                    const role = localizeRole(roleById[ev.role], lang);
                    const newYear = i === 0 || events[i - 1].year !== ev.year;
                    return (
                        <motion.li key={ev.id} className="relative pl-6" {...reveal()}>
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
            </ol>
        </div>
    );
};

export default VerticalTimeline;
