import { motion, useScroll, useTransform } from "framer-motion";
import HeroSpotlight from "./HeroSpotlight";

// First screen: the name over the spotlight wall. Scrolling pushes the two words apart.
const Hero = () => {
    const { scrollY } = useScroll();
    const progress = useTransform(scrollY, (y) => Math.min(y / window.innerHeight, 1));
    const leftX = useTransform(progress, (p) => `${-p * 100}vw`);
    const rightX = useTransform(progress, (p) => `${p * 100}vw`);

    return (
        <section id="aboutMeText" className="relative w-full h-screen flex flex-col items-center justify-center text-center text-white">
            <HeroSpotlight />
            <h1 className="relative z-10 flex flex-col items-center font-syncopate font-normal text-[7vw] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] 2xl:text-[8rem]">
                <motion.span style={{ x: leftX }}>BRUNO</motion.span>
                <motion.span style={{ x: rightX }}>SANTOS</motion.span>
            </h1>
        </section>
    );
};

export default Hero;
