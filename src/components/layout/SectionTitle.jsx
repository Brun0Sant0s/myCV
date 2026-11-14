import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const ease = (v) => 1 - Math.pow(1 - v, 3);

// Title between sections, compact (about 240px): a huge outlined section number sits behind the title.
// As the title scrolls into view both rise, the number more slowly than the title, which gives depth;
// the title fades in and the subtitle follows.
// `contentId` (the section it introduces) is kept for the callers but no longer needed.
const SectionTitle = ({ id, words, number, subtitle }) => {
    const ref = useRef(null);
    const reduceMotion = useReducedMotion();

    // 0 when the title's top reaches the bottom of the window, 1 when its centre reaches the middle
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
    const p = useTransform(scrollYProgress, (v) => (reduceMotion ? 1 : ease(v)));

    const numberY = useTransform(p, (a) => (1 - a) * 50 - 6);
    const titleY = useTransform(p, (a) => (1 - a) * 80);
    const titleOpacity = useTransform(p, (a) => a);
    const subtitleOpacity = useTransform(p, (a) => Math.max(0, Math.min(1, (a - 0.6) / 0.35)));

    return (
        <section
            ref={ref}
            id={id}
            className="relative w-full h-[180px] sm:h-[240px] flex flex-col items-center justify-center gap-4 sm:gap-5 px-6 text-center text-white overflow-hidden"
        >
            <div className="relative flex items-center justify-center">
                <motion.span
                    aria-hidden="true"
                    className="absolute font-syncopate font-normal leading-none text-transparent select-none text-[110px] sm:text-[160px] lg:text-[190px]"
                    style={{ y: numberY, WebkitTextStroke: "1.5px rgba(255,255,255,0.26)" }}
                >
                    {number}
                </motion.span>
                <h2 className="relative font-syncopate font-normal leading-tight text-[26px] sm:text-4xl lg:text-5xl [text-wrap:balance]">
                    <motion.span className="inline-block" style={{ y: titleY, opacity: titleOpacity }}>
                        {words.join(" ")}
                    </motion.span>
                </h2>
            </div>
            <motion.p
                className="relative font-montserrat font-light text-[13px] sm:text-sm text-gray-400 max-w-xl"
                style={{ opacity: subtitleOpacity }}
            >
                {subtitle}
            </motion.p>
        </section>
    );
};

export default SectionTitle;
