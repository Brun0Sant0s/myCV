import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

// Touch screens get finger-sized arrows (44px); the mouse keeps the slimmer ones
const arrowClass =
    "tap w-9 h-9 [@media(pointer:coarse)]:w-11 [@media(pointer:coarse)]:h-11 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/40 active:bg-white/10";

// Previous arrow, one dot per item (the active one is longer), next arrow.
// Each dot is a thin bar inside a taller invisible button, so it is easy to hit with a finger.
// Used by the About cards, the timeline, the project screens and the certificates.
const CarouselControls = ({ count, active, onPrev, onNext, onSelect, dotLabel, prevLabel = "Previous", nextLabel = "Next", className = "" }) => (
    <div className={`flex items-center justify-center gap-3 sm:gap-4 ${className}`}>
        <button type="button" onClick={onPrev} aria-label={prevLabel} className={arrowClass}>
            <FiArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center">
            {Array.from({ length: count }, (_, i) => (
                <button
                    key={i}
                    type="button"
                    aria-label={dotLabel(i)}
                    aria-current={i === active ? "true" : undefined}
                    onClick={() => onSelect(i)}
                    className="flex items-center h-9 [@media(pointer:coarse)]:h-11 px-[3px]"
                >
                    <span
                        className="block h-1 rounded-full bg-white transition-all duration-300"
                        style={{ width: i === active ? 22 : 8, opacity: i === active ? 1 : 0.2 }}
                    />
                </button>
            ))}
        </div>

        <button type="button" onClick={onNext} aria-label={nextLabel} className={arrowClass}>
            <FiArrowRight className="w-4 h-4" />
        </button>
    </div>
);

export default CarouselControls;
