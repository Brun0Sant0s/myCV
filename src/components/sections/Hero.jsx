import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowDown, FiDownload } from "react-icons/fi";
import HeroSpotlight from "./HeroSpotlight";
import avatar from "../../assets/avatar-cut.webp";
import { ACCENT } from "../../constants/theme";
import { useLang } from "../../i18n/LanguageContext";

// First screen: my avatar, dimmed, the name, what I do and the two next steps.
// Large screens: the name, the line and the buttons on the left, my avatar on the right fading into the code.
// Phones and tablets: the name sits above my head.
// A light drifts slowly over a wall of the stack written as code (HeroSpotlight).
// Scrolling pushes the two words apart and fades the rest out.

// Size and place of the avatar (and of its black outline underneath)
const AVATAR =
    "absolute left-1/2 bottom-0 -translate-x-1/2 h-[68%] sm:h-[64%] max-lg:[@media(max-height:640px)]:h-[50%] lg:left-auto lg:right-[5vw] lg:translate-x-0 lg:h-[92%] w-auto max-w-none";
// Large screens: the bottom of the avatar fades out; the black outline fades a little later so no code shows through the shirt
const FADE_OUTLINE = "lg:[mask-image:linear-gradient(#000_70%,transparent_96%)]";
const FADE = "lg:[mask-image:linear-gradient(#000_62%,transparent_94%)]";

const Hero = () => {
    const { t } = useLang();
    const { scrollY } = useScroll();
    const progress = useTransform(scrollY, (y) => Math.min(y / window.innerHeight, 1));
    const leftX = useTransform(progress, (p) => `${-p * 100}vw`);
    const rightX = useTransform(progress, (p) => `${p * 100}vw`);
    const fade = useTransform(progress, (p) => Math.max(0, 1 - p * 1.5));

    return (
        <section
            id="aboutMeText"
            className="relative w-full h-[100svh] min-h-[560px] flex flex-col items-center justify-start pt-[14vh] sm:pt-[8vh] lg:items-start lg:justify-center lg:pt-0 lg:pl-[9vw] text-center lg:text-left text-white"
        >
            <HeroSpotlight />

            <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none overflow-hidden" style={{ opacity: fade }}>
                {/* A solid black copy of my outline hides the code wall behind me, so the code only shows on the background */}
                <img src={avatar} alt="" draggable={false} className={`${AVATAR} ${FADE_OUTLINE} brightness-0`} />
                <div className="hero-avatar absolute inset-0">
                    <img src={avatar} alt="" draggable={false} fetchPriority="high" className={`${AVATAR} ${FADE}`} />
                </div>
            </motion.div>

            <h1 className="relative z-10 flex flex-col items-center lg:items-start font-syncopate font-normal text-[7vw] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] 2xl:text-[8rem]">
                <motion.span style={{ x: leftX }}>BRUNO</motion.span>
                <motion.span style={{ x: rightX }}>SANTOS</motion.span>
            </h1>
            <motion.p
                style={{ opacity: fade, color: ACCENT }}
                className="relative z-10 mt-5 sm:mt-7 px-6 lg:px-0 font-montserrat text-[11px] sm:text-xs font-medium uppercase tracking-[0.25em]"
            >
                {t.hero.role}
            </motion.p>

            {/* The two next steps: at the bottom above the tab bar, under the line on large screens */}
            <motion.div
                style={{ opacity: fade }}
                className="absolute inset-x-0 bottom-[calc(max(16px,env(safe-area-inset-bottom))+72px)] z-10 flex flex-col items-center gap-5 px-5 lg:static lg:mt-10 lg:items-start lg:px-0"
            >
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    <a
                        href="#projectsText"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("projectsText")?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className="tap inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-montserrat text-sm font-medium text-black transition-opacity duration-300 hover:opacity-85"
                    >
                        {t.hero.projects}
                        <FiArrowDown className="w-4 h-4" aria-hidden="true" />
                    </a>
                    <a
                        href={`${import.meta.env.BASE_URL}documents/${t.about.cv}?v=${import.meta.env.VITE_CV_VERSION}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tap inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-5 py-2.5 font-montserrat text-sm font-medium text-white transition-colors duration-300 hover:border-white/60"
                    >
                        <FiDownload className="w-4 h-4" aria-hidden="true" />
                        {t.about.downloadCv}
                    </a>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
