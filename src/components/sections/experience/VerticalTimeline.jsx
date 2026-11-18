import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useLang } from "../../../i18n/LanguageContext";
import { localizeRole } from "../../../i18n/data";
import TimelineItem from "./TimelineItem";
import { roleById, events, years } from "./timeline";

/* ---------- Mobile / tablet: one row per year, opened on tap ---------- */

// Newest year first; each row shows a coloured dot per milestone (the lane's colour) and how many there are.
const YEARS = [...years].reverse().map((year) => ({ year, items: events.filter((ev) => ev.year === year) }));

const YearRow = ({ year, items, open, onToggle }) => {
    const { lang, t } = useLang();
    const bodyId = `timeline-${year}`;
    const [one, many] = t.experience.milestone;
    const headRef = useRef(null);

    // When a year above closes, this one slides up: once it has settled, bring its title back into view if it went off the top
    useEffect(() => {
        if (!open) return undefined;
        const id = setTimeout(() => {
            const head = headRef.current;
            if (head && head.getBoundingClientRect().top < 0) head.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 520);
        return () => clearTimeout(id);
    }, [open]);

    return (
        <li className="border-t border-white/10 last:border-b">
            <button
                ref={headRef}
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={bodyId}
                className="w-full flex items-center justify-between gap-4 py-5 text-left active:bg-white/[0.03]"
            >
                <span
                    className={`font-syncopate text-3xl leading-none transition-colors duration-300 ${open ? "text-white" : "text-transparent"}`}
                    style={{ WebkitTextStroke: `1px ${open ? "#fff" : "rgba(255,255,255,0.35)"}` }}
                >
                    {year}
                </span>
                <span className="flex items-center gap-3 font-montserrat text-xs text-gray-400">
                    <span className="flex gap-1" aria-hidden="true">
                        {items.map((ev) => (
                            <span key={ev.id} className="w-2 h-2 rounded-full" style={{ background: roleById[ev.role].color }} />
                        ))}
                    </span>
                    {items.length} {items.length === 1 ? one : many}
                    <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                </span>
            </button>

            {/* Opens to its own height (0fr → 1fr), so nothing is cut and nothing jumps */}
            <div
                id={bodyId}
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
                inert={!open}
            >
                <div className="overflow-hidden">
                    <ol className="relative ml-1 mb-7 border-l border-white/10 flex flex-col gap-8">
                        {items.map((ev) => {
                            const role = localizeRole(roleById[ev.role], lang);
                            return (
                                <li key={ev.id} className="relative pl-6 pt-1">
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
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </li>
    );
};

const VerticalTimeline = () => {
    // One year open at a time: opening a year closes the other. The latest year starts open.
    const [open, setOpen] = useState(YEARS[0].year);
    const toggle = (year) => setOpen((cur) => (cur === year ? null : year));

    return (
        <div className="w-full flex justify-center px-5 sm:px-8 pt-6 pb-16 text-left">
            <ul className="w-full max-w-xl">
                {YEARS.map(({ year, items }) => (
                    <YearRow key={year} year={year} items={items} open={open === year} onToggle={() => toggle(year)} />
                ))}
            </ul>
        </div>
    );
};

export default VerticalTimeline;
