import { useState } from "react";
import AccordionRow from "../../ui/AccordionRow";
import { useLang } from "../../../i18n/LanguageContext";
import { localizeRole } from "../../../i18n/data";
import TimelineItem from "./TimelineItem";
import { roleById, events, years } from "./timeline";

/* ---------- Mobile / tablet: one row per year, opened on tap ---------- */

// Newest year first; each row shows a coloured dot per milestone (the lane's colour) and how many there are.
const YEARS = [...years].reverse().map((year) => ({ year, items: events.filter((ev) => ev.year === year) }));

const YearRow = ({ year, items, open, onToggle }) => {
    const { lang, t } = useLang();
    const [one, many] = t.experience.milestone;

    return (
        <AccordionRow
            id={`timeline-${year}`}
            label={year}
            open={open}
            onToggle={onToggle}
            title={null}
            aside={
                <>
                    <span className="flex gap-1" aria-hidden="true">
                        {items.map((ev) => (
                            <span key={ev.id} className="w-2 h-2 rounded-full" style={{ background: roleById[ev.role].color }} />
                        ))}
                    </span>
                    {items.length} {items.length === 1 ? one : many}
                </>
            }
        >
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
        </AccordionRow>
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
