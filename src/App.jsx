import EditorNav from "./components/layout/EditorNav";
import LanguageSwitch from "./components/layout/LanguageSwitch";
import SectionTitle from "./components/layout/SectionTitle";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Certifications from "./components/sections/Certifications";
import Contacts from "./components/sections/Contacts";
import { useLang } from "./i18n/LanguageContext";

// The page, top to bottom. Each section is introduced by a big two-word title.
// Section ids are used by the tab bar (EditorNav) to scroll and to highlight the current tab.
const App = () => {
    const { t } = useLang();
    const s = t.sections;

    return (
        <div className="bg-black overflow-x-clip">
            <EditorNav />
            <LanguageSwitch />

            <Hero />
            <About />

            <SectionTitle
                id="professionalExperienceText"
                words={s.experience.words}
                number="01"
                subtitle={s.experience.subtitle}
                contentId="professionalExperienceContent"
            />
            <Experience />

            <SectionTitle id="projectsText" words={s.projects.words} number="02" subtitle={s.projects.subtitle} contentId="projectsContent" />
            <Projects />

            <SectionTitle
                id="certificationsText"
                words={s.certifications.words}
                number="03"
                subtitle={s.certifications.subtitle}
                contentId="certificationsContent"
            />
            <Certifications />

            <SectionTitle id="contactsText" words={s.contacts.words} number="04" subtitle={s.contacts.subtitle} contentId="contactsContent" />
            <Contacts />
        </div>
    );
};

export default App;
