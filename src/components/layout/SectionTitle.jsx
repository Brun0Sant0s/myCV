import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const clamp = (v) => Math.max(0, Math.min(1, v));

// Title between sections: the two words slide in from opposite sides as the title scrolls into view,
// and slide out again (crossing over) as the section it introduces comes in.
// `contentId` is the id of that section.
const SectionTitle = ({ id, words: [first, second], number, subtitle, contentId }) => {
    const ref = useRef(null);
    const { scrollY } = useScroll();

    // 0 → 1 while the title enters, 1 → 2 while its section takes over
    const progress = useTransform(scrollY, (y) => {
        const title = ref.current;
        if (!title) return 1;
        const vh = window.innerHeight;
        const content = document.getElementById(contentId);
        // The words only leave once the section has reached the middle of the screen,
        // so a title brought to the centre (from the tab bar) is shown whole.
        const exit = content ? clamp((y + vh / 2 - content.offsetTop) / (vh / 2)) : 0;
        if (exit > 0) return 1 + exit;
        return clamp((y - title.offsetTop + vh) / title.offsetHeight);
    });
    const leftX = useTransform(progress, (p) => `${(p - 1) * 100}vw`);
    const rightX = useTransform(progress, (p) => `${(1 - p) * 100}vw`);

    return (
        <section
            ref={ref}
            id={id}
            className="relative w-full h-[30vh] min-h-[240px] flex flex-col items-center justify-center gap-4 md:gap-6 text-center text-white"
        >
            <h2 className="flex flex-col items-center font-syncopate font-normal text-[7vw] sm:text-5xl md:text-[3.5rem] lg:text-[4rem] xl:text-[4.75rem] 2xl:text-[6rem]">
                <motion.span style={{ x: leftX }}>{first}</motion.span>
                <motion.span style={{ x: rightX }}>{second}</motion.span>
            </h2>
            <p className="flex items-center justify-center gap-3 px-6 font-montserrat font-light text-sm md:text-base text-gray-400">
                <span className="font-syncopate text-xs md:text-sm text-[#20C997]">{number}</span>
                {subtitle}
            </p>
        </section>
    );
};

export default SectionTitle;
