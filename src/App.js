import TerminalNav from "./components/TerminalNav";
import Hero from "./components/Hero";
import SectionTitle from "./components/SectionTitle";
import AboutMeContent from "./components/aboutMe";
import ProfessionalExperienceContent from "./components/profissionalExperience";
import ProjectsContent from "./components/projects";
import CertificationsContent from "./components/certifications";
import ContactsContent from "./components/contacts";

// The page, top to bottom. Each section is introduced by a big two-word title.
// Section ids are used by the tab bar (TerminalNav) to scroll and to highlight the current tab.
const App = () => (
    <div className="bg-black overflow-x-clip">
        <TerminalNav />

        <Hero />
        <AboutMeContent />

        <SectionTitle
            id="professionalExperienceText"
            words={["Professional", "Experience"]}
            number="01"
            subtitle="Four years at ePharma, my own products and live shows, year by year."
            contentId="professionalExperienceContent"
        />
        <ProfessionalExperienceContent />

        <SectionTitle
            id="projectsText"
            words={["My", "Projects"]}
            number="02"
            subtitle="Products and client work I designed and built, from idea to launch."
            contentId="projectsContent"
        />
        <ProjectsContent />

        <SectionTitle
            id="certificationsText"
            words={["My", "Certifications"]}
            number="03"
            subtitle="Courses I completed to keep growing as a developer."
            contentId="certificationsContent"
        />
        <CertificationsContent />

        <SectionTitle
            id="contactsText"
            words={["My", "Contacts"]}
            number="04"
            subtitle="Email, phone or a quick message, whichever suits you."
            contentId="contactsContent"
        />
        <ContactsContent />
    </div>
);

export default App;
