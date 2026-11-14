import { motion, useScroll, useTransform } from "framer-motion";
import HeroSpotlight from "./HeroSpotlight";
import avatar from "../../assets/avatar-cut.webp";
import { useLang } from "../../i18n/LanguageContext";

// First screen: the name over the spotlight wall.
// With a mouse, the cursor torch also reveals my avatar behind the name (see .hero-avatar in global.css).
// On touch screens the whole avatar shows, dimmed, behind the name.
// Scrolling pushes the two words apart and fades the avatar out.
const Hero = () => {
    const { t } = useLang();
    const { scrollY } = useScroll();
    const progress = useTransform(scrollY, (y) => Math.min(y / window.innerHeight, 1));
    const leftX = useTransform(progress, (p) => `${-p * 100}vw`);
    const rightX = useTransform(progress, (p) => `${p * 100}vw`);
    const fade = useTransform(progress, (p) => Math.max(0, 1 - p * 1.5));

    return (
        <section id="aboutMeText" className="relative w-full h-screen flex flex-col items-center justify-center text-center text-white">
            <HeroSpotlight />

            <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none" style={{ opacity: fade }}>
                <div className="hero-avatar absolute inset-0 overflow-hidden">
                    <img
                        src={avatar}
                        alt=""
                        draggable={false}
                        className="absolute left-1/2 bottom-0 -translate-x-1/2 h-[68%] sm:h-[80%] lg:h-[92%] w-auto max-w-none"
                    />
                </div>
            </motion.div>

            <h1 className="relative z-10 flex flex-col items-center font-syncopate font-normal text-[7vw] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] 2xl:text-[8rem]">
                <motion.span style={{ x: leftX }}>BRUNO</motion.span>
                <motion.span style={{ x: rightX }}>SANTOS</motion.span>
            </h1>

            {/* Only where there is a mouse: phones get a light that wanders on its own */}
            <motion.p
                style={{ opacity: fade }}
                className="hidden [@media(pointer:fine)]:block absolute bottom-24 inset-x-0 z-10 font-montserrat text-[11px] font-medium uppercase tracking-[0.25em] text-white/40"
            >
                {t.hero.hint}
            </motion.p>
        </section>
    );
};

export default Hero;
