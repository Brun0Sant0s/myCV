import { FiArrowUpRight } from "react-icons/fi";
import { projectMarks } from "../../../assets/projects";
import TechBadge from "../../ui/TechBadge";
import { useLang } from "../../../i18n/LanguageContext";
import { localizeEvent } from "../../../i18n/data";
import { DATE_COL, monthOf } from "./timeline";

// One moment: the month in large type, a thin rule, then the title, text, technologies and link.
const TimelineItem = ({ ev: source, color }) => {
    const { lang, t } = useLang();
    const ev = localizeEvent(source, lang);
    const month = monthOf(source);
    const mark = ev.logo && projectMarks[ev.logo];
    return (
        <div className="grid text-left" style={{ gridTemplateColumns: `${DATE_COL}px 1fr`, columnGap: 16 }}>
            <div className="pt-0.5">
                {month && (
                    <p className="font-syncopate text-lg leading-none" style={{ color }}>
                        {t.experience.months[month] || month}
                    </p>
                )}
            </div>

            <div className="min-w-0 border-l border-white/10 pl-4">
                <div className="flex items-center gap-2.5">
                    {mark && (
                        <span className="flex items-center justify-center w-9 h-9 shrink-0">
                            <img src={mark} alt="" loading="lazy" className="max-w-full max-h-full object-contain" />
                        </span>
                    )}
                    <h4 className="font-montserrat font-semibold text-white text-lg leading-snug">{ev.title}</h4>
                    {ev.status && (
                        <span className="font-montserrat text-[10px] text-gray-300 bg-white/[0.07] rounded-full px-2.5 py-0.5 whitespace-nowrap">
                            {ev.status}
                        </span>
                    )}
                </div>
                <p className="mt-2.5 font-montserrat font-light text-sm lg:text-[15px] text-gray-400 leading-relaxed">{ev.text}</p>
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

export default TimelineItem;
