import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import certifications from "../../data/certifications.json";
import angularImg from "../../assets/certifications/angular.webp";
import reactNativeImg from "../../assets/certifications/react-native.webp";
import frontEndImg from "../../assets/certifications/frontend.webp";
import cybersecurityImg from "../../assets/certifications/cybersecurity.webp";
import uiuxImg from "../../assets/certifications/uiux.webp";
import { ACCENT, EASE } from "../../constants/theme";
import CarouselControls from "../ui/CarouselControls";
import useAutoplay from "../../hooks/useAutoplay";
import useReveal from "../../hooks/useReveal";
import { useLang } from "../../i18n/LanguageContext";
import { localizeCertification } from "../../i18n/data";

const images = {
    angular: angularImg,
    reactNative: reactNativeImg,
    frontEnd: frontEndImg,
    cybersecurity: cybersecurityImg,
    uiux: uiuxImg,
};

const num = (i) => String(i + 1).padStart(2, "0");

const Certificate = ({ cert, className = "", style }) => {
    const { t } = useLang();
    return (
        <img
            src={images[cert.imageKey]}
            alt={`${cert.title}: ${t.certifications.certificate}`}
            draggable={false}
            loading="lazy"
            decoding="async"
            className={`block max-w-full max-h-full w-auto h-auto rounded-lg border border-white/20 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.6)] select-none ${className}`}
            style={style}
        />
    );
};

const Certifications = () => {
    const { lang, t } = useLang();
    const reduceMotion = useReducedMotion();
    const [[active, dir], setState] = useState([0, 0]);
    const n = certifications.length;
    const cert = localizeCertification(certifications[active], lang);
    const prev = certifications[(active - 1 + n) % n];
    const next = certifications[(active + 1) % n];
    const go = (step) => setState(([a]) => [(a + step + n) % n, step]);
    const pick = (i) => setState([i, i > active ? 1 : -1]);
    const stageRef = useRef(null);
    useAutoplay(stageRef, () => go(1), active);

    const reveal = useReveal();

    // Neighbours tilted behind the active certificate, like the Projects stage
    const side = (c, s) => (
        <button
            type="button"
            aria-label={`${s < 0 ? t.carousel.previous : t.carousel.next}: ${c.title}`}
            onClick={() => go(s)}
            className="absolute top-1/2 left-1/2 w-[78%] h-[78%] flex items-center justify-center opacity-35 hover:opacity-60 transition-opacity duration-300"
            style={{ transform: `translate(calc(-50% + ${s * 24}%), -50%) rotate(${s * 5}deg)` }}
        >
            <Certificate cert={c} />
        </button>
    );

    return (
        <div
            id="certificationsContent"
            className="relative w-full lg:min-h-screen flex items-center justify-center bg-black text-white px-5 sm:px-8 py-14 sm:py-24 lg:py-28"
        >
            <div className="mx-auto w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)_minmax(0,1fr)] gap-y-10 md:gap-y-12 md:gap-x-10 lg:gap-x-20 items-center">
                {/* Left: the selected course */}
                <motion.div className="text-left lg:text-right flex flex-col lg:items-end" {...reveal(0.05)}>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={cert.id}
                            className="flex flex-col lg:items-end"
                            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                            transition={{ duration: 0.35, ease: EASE }}
                        >
                            <span
                                className="font-syncopate text-5xl sm:text-7xl leading-none text-transparent"
                                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.22)" }}
                            >
                                {num(active)}
                            </span>
                            <p className="mt-6 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                                {cert.issuer}
                            </p>
                            <h3 className="mt-3 font-montserrat font-semibold text-3xl sm:text-4xl text-white leading-tight">{cert.title}</h3>
                            <p className="mt-5 max-w-md font-montserrat font-light text-[15px] text-gray-400 leading-relaxed">{cert.description}</p>
                            <a
                                href={`${import.meta.env.BASE_URL}${cert.downloadLink}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tap mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-full bg-white px-5 py-3 lg:px-4 lg:py-2 font-montserrat text-sm font-medium text-black hover:bg-white/85"
                            >
                                {t.certifications.viewCertificate}
                                <FiArrowUpRight className="w-4 h-4" />
                            </a>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Centre: the stage */}
                <motion.div ref={stageRef} className="min-w-0 flex flex-col gap-4 sm:gap-6 order-first md:order-none" {...reveal(0.1)}>
                    <div
                        className="relative h-[clamp(220px,62vw,300px)] sm:h-[360px] lg:h-[420px] outline-none"
                        tabIndex={0}
                        role="region"
                        aria-roledescription="carousel"
                        aria-label={t.certifications.carouselLabel}
                        onKeyDown={(e) => {
                            if (e.key === "ArrowRight") go(1);
                            if (e.key === "ArrowLeft") go(-1);
                        }}
                    >
                        {side(prev, -1)}
                        {side(next, 1)}
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                                key={cert.id}
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
                                <Certificate cert={cert} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <CarouselControls
                        count={certifications.length}
                        active={active}
                        onPrev={() => go(-1)}
                        onNext={() => go(1)}
                        onSelect={pick}
                        dotLabel={(i) => certifications[i].title}
                        prevLabel={t.certifications.prevCertificate}
                        nextLabel={t.certifications.nextCertificate}
                    />
                </motion.div>

                {/* Right: every course */}
                <motion.div className="md:col-span-2 lg:col-span-1" {...reveal(0.15)}>
                    <p className="mb-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">{t.certifications.allCourses}</p>
                    <ul className="border-t border-white/10 md:grid md:grid-cols-2 md:gap-x-10 lg:block" role="tablist">
                        {certifications.map((c, i) => {
                            const on = i === active;
                            return (
                                <li key={c.id}>
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={on}
                                        onClick={() => pick(i)}
                                        className={`w-full flex items-baseline gap-4 py-4 active:bg-white/[0.04] lg:py-3.5 border-b border-white/10 text-left font-montserrat text-sm transition-colors duration-300 ${
                                            on ? "text-white" : "text-gray-400 hover:text-gray-200"
                                        }`}
                                    >
                                        <span className="font-syncopate text-[11px]" style={{ color: on ? ACCENT : undefined }}>
                                            {num(i)}
                                        </span>
                                        <span>{c.title}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default Certifications;
