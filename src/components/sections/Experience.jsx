import useMediaQuery from "../../hooks/useMediaQuery";
import SwimlaneTimeline from "./experience/SwimlaneTimeline";
import VerticalTimeline from "./experience/VerticalTimeline";

// Timeline of the three lanes (ePharma, my projects, pyrotechnics).
// Desktop: swimlanes that move year by year as you scroll. Phones and tablets: one vertical list.
const Experience = () => {
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    return (
        <div id="professionalExperienceContent" className="relative w-full bg-black text-white">
            {isDesktop ? <SwimlaneTimeline /> : <VerticalTimeline />}
        </div>
    );
};

export default Experience;
