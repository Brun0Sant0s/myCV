import EditorNav from "./components/layout/EditorNav";
import SectionTitle from "./components/layout/SectionTitle";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Certifications from "./components/sections/Certifications";
import Contacts from "./components/sections/Contacts";

// The page, top to bottom. Each section is introduced by a big two-word title.
// Section ids are used by the tab bar (EditorNav) to scroll and to highlight the current tab.
const App = () => (
    <div className="bg-black overflow-x-clip">
        <EditorNav />

        <Hero />
        <About />

        <SectionTitle
            id="professionalExperienceText"
            words={["Professional", "Experience"]}
            number="01"
            subtitle="Four years at ePharma, my own products and live shows, year by year."
            contentId="professionalExperienceContent"
        />
        <Experience />

        <SectionTitle
            id="projectsText"
            words={["My", "Projects"]}
            number="02"
            subtitle="Products and client work I designed and built, from idea to launch."
            contentId="projectsContent"
        />
        <Projects />

        <SectionTitle
            id="certificationsText"
            words={["My", "Certifications"]}
            number="03"
            subtitle="Courses I completed to keep growing as a developer."
            contentId="certificationsContent"
        />
        <Certifications />

        <SectionTitle
            id="contactsText"
            words={["My", "Contacts"]}
            number="04"
            subtitle="Email, phone or a quick message, whichever suits you."
            contentId="contactsContent"
        />
        <Contacts />
    </div>
);

export default App;
