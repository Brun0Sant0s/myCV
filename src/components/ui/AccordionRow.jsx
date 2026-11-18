import { useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

// One row of the phone and tablet lists (timeline years, projects, certificates):
// a big outlined label that fills in white when open, something in the middle, a note and a chevron on the right.
// The body opens to its own height (0fr → 1fr), so nothing is cut and nothing jumps.
// The parent decides which row is open, so opening one can close the others.
const AccordionRow = ({ as: Tag = "li", id, label, labelClassName = "", title, aside, open, onToggle, children }) => {
    const headRef = useRef(null);

    // When a row above closes, this one slides up: once it has settled, bring it back into view if it went off the top
    useEffect(() => {
        if (!open) return undefined;
        const timer = setTimeout(() => {
            const head = headRef.current;
            if (head && head.getBoundingClientRect().top < 0) head.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 520);
        return () => clearTimeout(timer);
    }, [open]);

    return (
        <Tag className="border-t border-white/10 last:border-b">
            <button
                ref={headRef}
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={id}
                className="w-full flex items-center gap-4 py-5 text-left active:bg-white/[0.03]"
            >
                <span
                    className={`shrink-0 font-syncopate text-3xl leading-none transition-colors duration-300 ${open ? "text-white" : "text-transparent"} ${labelClassName}`}
                    style={{ WebkitTextStroke: `1px ${open ? "#fff" : "rgba(255,255,255,0.35)"}` }}
                >
                    {label}
                </span>
                <span className="flex items-center gap-3 min-w-0 flex-1">{title}</span>
                <span className="flex items-center gap-3 shrink-0 font-montserrat text-xs text-gray-400">
                    {aside}
                    <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                </span>
            </button>

            <div
                id={id}
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
                inert={!open}
            >
                <div className="overflow-hidden">{children}</div>
            </div>
        </Tag>
    );
};

export default AccordionRow;
