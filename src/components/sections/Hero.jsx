import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowDown, FiDownload } from "react-icons/fi";
import HeroSpotlight from "./HeroSpotlight";
import avatar from "../../assets/avatar-cut.webp";
import { ACCENT } from "../../constants/theme";
import { useLang } from "../../i18n/LanguageContext";

// First screen: the name over the spotlight wall, what I do and the two next steps.
// With a mouse, the cursor torch also reveals my avatar behind the name (see .hero-avatar in global.css).
// On touch screens the whole avatar shows, dimmed, and the name sits above my head instead of over my face.
// Scrolling pushes the two words apart and fades the rest out.
const touchTop = "[@media(pointer:coarse)]:justify-start [@media(pointer:coarse)]:pt-[14vh] [@media(pointer:coarse)]:sm:pt-[8vh]";

const Hero = () => {
    const { t } = useLang();
    const { scrollY } = useScroll();
    const progress = useTransform(scrollY, (y) => Math.min(y / window.innerHeight, 1));
    const leftX = useTransform(progress, (p) => `${-p * 100}vw`);
    const rightX = useTransform(progress, (p) => `${p * 100}vw`);
    const fade = useTransform(progress, (p) => Math.max(0, 1 - p * 1.5));

    return (
        <section id="aboutMeText" className={`relative w-full h-screen flex flex-col items-center justify-center text-center text-white ${touchTop}`}>
            <HeroSpotlight />

            <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none" style={{ opacity: fade }}>
                <div className="hero-avatar absolute inset-0 overflow-hidden">
                    <img
                        src={avatar}
                        alt=""
                        draggable={false}
                        fetchPriority="high"
                        className="absolute left-1/2 bottom-0 -translate-x-1/2 h-[68%] sm:h-[80%] lg:h-[92%] w-auto max-w-none"
                    />
                </div>
            </motion.div>

            <h1 className="relative z-10 flex flex-col items-center font-syncopate font-normal text-[7vw] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] 2xl:text-[8rem]">
                <motion.span style={{ x: leftX }}>BRUNO</motion.span>
                <motion.span style={{ x: rightX }}>SANTOS</motion.span>
            </h1>
            <motion.p
                style={{ opacity: fade, color: ACCENT }}
                className="relative z-10 mt-5 sm:mt-7 px-6 font-montserrat text-[11px] sm:text-xs font-medium uppercase tracking-[0.25em]"
            >
                {t.hero.role}
            </motion.p>

            {/* Bottom: the two next steps, above the tab bar */}
            <motion.div
                style={{ opacity: fade }}
                className="absolute inset-x-0 bottom-[calc(max(16px,env(safe-area-inset-bottom))+72px)] z-10 flex flex-col items-center gap-5 px-5"
            >
                {/* Only where there is a mouse: phones get a light that wanders on its own */}
                <p className="hidden [@media(pointer:fine)]:block font-montserrat text-[11px] font-medium uppercase tracking-[0.25em] text-white/50">
                    {t.hero.hint}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <a
                        href="#projectsText"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("projectsText")?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-montserrat text-sm font-medium text-black transition-opacity duration-300 hover:opacity-85"
                    >
                        {t.hero.projects}
                        <FiArrowDown className="w-4 h-4" aria-hidden="true" />
                    </a>
                    <a
                        href={`${import.meta.env.BASE_URL}documents/${t.about.cv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-5 py-2.5 font-montserrat text-sm font-medium text-white transition-colors duration-300 hover:border-white/60"
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
