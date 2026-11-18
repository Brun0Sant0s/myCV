import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Moves a carousel forward every `delay` ms.
// It waits while the carousel is off screen, while the mouse is over it, while it has
// keyboard focus, while the tab is hidden, and when the visitor prefers reduced motion.
// Any change of `step` (a click, a swipe, an arrow key) restarts the countdown.
// On touch screens it stops for good once the visitor touches the carousel, so it never moves while they read.
const useAutoplay = (ref, advance, step, delay = 5000) => {
    const reduceMotion = useReducedMotion();
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [pageVisible, setPageVisible] = useState(!document.hidden);
    const [touched, setTouched] = useState(false);

    // Always call the latest advance without restarting the timer when it changes identity
    const advanceRef = useRef(advance);
    useEffect(() => {
        advanceRef.current = advance;
    });

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;

        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
        observer.observe(el);

        // Touch taps also fire pointer events; only a real mouse should pause
        const enter = (e) => e.pointerType === "mouse" && setHovered(true);
        const leave = (e) => e.pointerType === "mouse" && setHovered(false);
        const focusIn = () => setFocused(el.matches(":focus-visible") || !!el.querySelector(":focus-visible"));
        const focusOut = (e) => !el.contains(e.relatedTarget) && setFocused(false);
        const onVisibility = () => setPageVisible(!document.hidden);
        const down = (e) => e.pointerType !== "mouse" && setTouched(true);

        el.addEventListener("pointerdown", down);
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        el.addEventListener("focusin", focusIn);
        el.addEventListener("focusout", focusOut);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            observer.disconnect();
            el.removeEventListener("pointerdown", down);
            el.removeEventListener("pointerenter", enter);
            el.removeEventListener("pointerleave", leave);
            el.removeEventListener("focusin", focusIn);
            el.removeEventListener("focusout", focusOut);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [ref]);

    const running = !reduceMotion && visible && !hovered && !focused && pageVisible && !touched;

    useEffect(() => {
        if (!running) return undefined;
        const id = setTimeout(() => advanceRef.current(), delay);
        return () => clearTimeout(id);
    }, [running, step, delay]);
};

export default useAutoplay;
