import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const arrowClass =
    "w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/40";

// Previous arrow, one dot per item (the active one is longer), next arrow.
// Used by the About cards, the timeline, the project screens and the certificates.
const CarouselControls = ({ count, active, onPrev, onNext, onSelect, dotLabel, prevLabel = "Previous", nextLabel = "Next", className = "" }) => (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
        <button type="button" onClick={onPrev} aria-label={prevLabel} className={arrowClass}>
            <FiArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
            {Array.from({ length: count }, (_, i) => (
                <button
                    key={i}
                    type="button"
                    aria-label={dotLabel(i)}
                    onClick={() => onSelect(i)}
                    className="h-1 rounded-full bg-white transition-all duration-300"
                    style={{ width: i === active ? 22 : 8, opacity: i === active ? 1 : 0.2 }}
                />
            ))}
        </div>

        <button type="button" onClick={onNext} aria-label={nextLabel} className={arrowClass}>
            <FiArrowRight className="w-4 h-4" />
        </button>
    </div>
);

export default CarouselControls;
