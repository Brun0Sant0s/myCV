import { useEffect, useRef, useState } from "react";
import {
    SiReact,
    SiTypescript,
    SiNodedotjs,
    SiFirebase,
    SiExpo,
    SiTailwindcss,
    SiVercel,
    SiPython,
    SiFastapi,
    SiMysql,
    SiExpress,
    SiRaspberrypi,
    SiGooglemaps,
} from "react-icons/si";
import jsLogo from "../../assets/icons/js.svg";
import htmlLogo from "../../assets/icons/html.svg";
import cssLogo from "../../assets/icons/css.svg";
import jqueryLogo from "../../assets/icons/jquery.svg";
import javaLogo from "../../assets/icons/java.svg";
import angularLogo from "../../assets/icons/angular.svg";

// Strings are SVG files; objects are react-icons components (always shown in their brand colour).
const techIcons = {
    JavaScript: jsLogo,
    HTML: htmlLogo,
    CSS: cssLogo,
    JQuery: jqueryLogo,
    Java: javaLogo,
    Angular: angularLogo,
    React: { Icon: SiReact, color: "#61DAFB" },
    "React Native": { Icon: SiReact, color: "#61DAFB" },
    TypeScript: { Icon: SiTypescript, color: "#3178C6" },
    "Node.js": { Icon: SiNodedotjs, color: "#5FA04E" },
    Firebase: { Icon: SiFirebase, color: "#FFCA28" },
    Expo: { Icon: SiExpo, color: "#FFFFFF" },
    Tailwind: { Icon: SiTailwindcss, color: "#38BDF8" },
    Vercel: { Icon: SiVercel, color: "#FFFFFF" },
    Python: { Icon: SiPython, color: "#FFD43B" },
    FastAPI: { Icon: SiFastapi, color: "#05998B" },
    MySQL: { Icon: SiMysql, color: "#5B9BD5" },
    Express: { Icon: SiExpress, color: "#FFFFFF" },
    "Raspberry Pi": { Icon: SiRaspberrypi, color: "#C51A4A" },
    "Google Maps": { Icon: SiGooglemaps, color: "#4285F4" },
};

// Hovering with the mouse shows the name. Touch screens have no hover, so a tap shows it for a moment instead.
const TechBadge = ({ name, size = "sm" }) => {
    const icon = techIcons[name];
    const [shown, setShown] = useState(false);
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current), []);
    if (!icon) return null;
    const onTap = (e) => {
        if (e.pointerType === "mouse") return;
        clearTimeout(timer.current);
        setShown(true);
        timer.current = setTimeout(() => setShown(false), 1600);
    };
    const label = name === "JQuery" ? "jQuery" : name;
    const box = size === "lg" ? "w-8 h-8" : "w-7 h-7";
    const glyph = size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5";
    return (
        <span
            title={label}
            onPointerUp={onTap}
            className={`group/tech relative flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.08] ${box}`}
        >
            {typeof icon === "string" ? (
                <img src={icon} alt={label} className={`${glyph} object-contain`} />
            ) : (
                <icon.Icon aria-label={label} className={glyph} style={{ color: icon.color }} />
            )}
            <span
                className={`pointer-events-none z-10 absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-1.5 py-0.5 font-montserrat text-[10px] text-black transition-opacity duration-200 group-hover/tech:opacity-100 ${shown ? "opacity-100" : "opacity-0"}`}
            >
                {label}
            </span>
        </span>
    );
};

export default TechBadge;
