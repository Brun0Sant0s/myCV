import { useReducedMotion } from "framer-motion";
import { EASE } from "../constants/theme";

// Entrance used by every section: content rises and fades in the first time it scrolls into view.
// Returns a function that gives the motion props for one element, with an optional delay to stagger columns.
// With reduced motion it returns no animation at all.
const useReveal = ({ y = 32, amount = 0.2 } = {}) => {
    const reduceMotion = useReducedMotion();
    return (delay = 0) =>
        reduceMotion
            ? {}
            : {
                  initial: { opacity: 0, y },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount },
                  transition: { duration: 0.7, ease: EASE, delay },
              };
};

export default useReveal;
