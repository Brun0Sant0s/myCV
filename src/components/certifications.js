import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import certifications from "../json/certifications.json";
import angularImg from "../assets/certifications/angular.png";
import reactNativeImg from "../assets/certifications/react-native.png";
import frontEndImg from "../assets/certifications/frontend.png";
import cybersecurityImg from "../assets/certifications/cybersecurity.png";
import uiuxImg from "../assets/certifications/uiux.png";

const EASE = [0.22, 1, 0.36, 1];
const ACCENT = "#20C997";

const images = {
    angular: angularImg,
    reactNative: reactNativeImg,
    frontEnd: frontEndImg,
    cybersecurity: cybersecurityImg,
    uiux: uiuxImg,
};

const num = (i) => String(i + 1).padStart(2, "0");

const Certificate = ({ cert, className = "", style }) => (
    <img
        src={images[cert.imageKey]}
        alt={`${cert.title} certificate`}
        draggable={false}
        className={`block max-w-full max-h-full w-auto h-auto rounded-lg border border-white/20 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.6)] select-none ${className}`}
        style={style}
    />
);

const CertificationsContent = () => {
    const reduceMotion = useReducedMotion();
    const [[active, dir], setState] = useState([0, 0]);
    const n = certifications.length;
    const cert = certifications[active];
    const prev = certifications[(active - 1 + n) % n];
    const next = certifications[(active + 1) % n];
    const go = (step) => setState(([a]) => [(a + step + n) % n, step]);
    const pick = (i) => setState([i, i > active ? 1 : -1]);

    const reveal = (delay = 0) =>
        reduceMotion
            ? {}
            : {
                  initial: { opacity: 0, y: 32 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.2 },
                  transition: { duration: 0.7, ease: EASE, delay },
              };

    // Neighbours tilted behind the active certificate, like the Projects stage
    const side = (c, s) => (
        <button
            type="button"
            aria-label={`${s < 0 ? "Previous" : "Next"}: ${c.title}`}
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
            className="relative w-full min-h-screen flex items-center justify-center bg-black text-white px-5 sm:px-8 py-20 sm:py-28"
        >
            <div className="mx-auto w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)_minmax(0,1fr)] gap-y-12 lg:gap-x-20 items-center">
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
                                className="font-syncopate text-6xl sm:text-7xl leading-none text-transparent"
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
                                href={`${process.env.PUBLIC_URL}${cert.downloadLink}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-7 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 font-montserrat text-sm text-black transition-colors duration-300 hover:bg-white/85"
                            >
                                View certificate
                                <FiArrowUpRight className="w-4 h-4" />
                            </a>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Centre: the stage */}
                <motion.div className="min-w-0 flex flex-col gap-6" {...reveal(0.1)}>
                    <div
                        className="relative h-[300px] sm:h-[420px] outline-none"
                        tabIndex={0}
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Certificates"
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

                    <div className="flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Previous certificate"
                            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/40"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1.5">
                            {certifications.map((c, i) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    aria-label={c.title}
                                    onClick={() => pick(i)}
                                    className="h-1 rounded-full bg-white transition-all duration-300"
                                    style={{ width: i === active ? 22 : 8, opacity: i === active ? 1 : 0.2 }}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Next certificate"
                            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/40"
                        >
                            <FiArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>

                {/* Right: every course */}
                <motion.div {...reveal(0.15)}>
                    <p className="mb-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">All courses</p>
                    <ul className="border-t border-white/10" role="tablist">
                        {certifications.map((c, i) => {
                            const on = i === active;
                            return (
                                <li key={c.id}>
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={on}
                                        onClick={() => pick(i)}
                                        className={`w-full flex items-baseline gap-4 py-3.5 border-b border-white/10 text-left font-montserrat text-sm transition-colors duration-300 ${
                                            on ? "text-white" : "text-gray-500 hover:text-gray-200"
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

export default CertificationsContent;
