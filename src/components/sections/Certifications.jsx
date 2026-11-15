import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import certifications from "../../data/certifications.json";
import { ACCENT } from "../../constants/theme";
import useReveal from "../../hooks/useReveal";
import { useLang } from "../../i18n/LanguageContext";
import { localizeCertification } from "../../i18n/data";

const num = (i) => String(i + 1).padStart(2, "0");

// Courses as a compact list: they back up the experience and projects, so they get less room than them.
// Each card opens the certificate PDF.
const Certifications = () => {
    const { lang, t } = useLang();
    const reveal = useReveal({ y: 24 });

    return (
        <section id="certificationsContent" className="relative w-full bg-black text-white px-5 sm:px-8 py-20 sm:py-28 border-t border-white/[0.08]">
            <div className="mx-auto w-full max-w-[1400px]">
                <motion.header className="mb-10 sm:mb-14 flex flex-col gap-3" {...reveal()}>
                    <span className="font-syncopate text-xs md:text-sm" style={{ color: ACCENT }}>
                        03
                    </span>
                    <h2 className="font-syncopate font-normal text-3xl sm:text-4xl lg:text-5xl">{t.certifications.title}</h2>
                    <p className="font-montserrat font-light text-sm md:text-base text-gray-400">{t.certifications.subtitle}</p>
                </motion.header>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certifications.map((source, i) => {
                        const cert = localizeCertification(source, lang);
                        return (
                            <motion.li key={cert.id} {...reveal(0.05 * i)}>
                                <a
                                    href={`${import.meta.env.BASE_URL}${cert.downloadLink}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group h-full flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.04]"
                                >
                                    <span className="flex items-center justify-between gap-4">
                                        <span className="font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                                            {cert.issuer}
                                        </span>
                                        <span className="font-syncopate text-[11px] text-gray-500">{num(i)}</span>
                                    </span>
                                    <span className="font-montserrat font-semibold text-lg text-white leading-snug">{cert.title}</span>
                                    <span className="font-montserrat font-light text-sm text-gray-400 leading-relaxed">{cert.description}</span>
                                    <span className="mt-auto pt-2 inline-flex items-center gap-1 font-montserrat text-sm text-white">
                                        {t.certifications.viewCertificate}
                                        <FiArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                    </span>
                                </a>
                            </motion.li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

export default Certifications;
