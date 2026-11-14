import { createContext, useContext, useEffect, useMemo, useState } from "react";
import strings from "./strings";

// The site speaks English or Portuguese.
// First visit: Portuguese if the browser is set to Portuguese, English otherwise.
// After that, the visitor's choice is remembered on this device.
const STORAGE_KEY = "lang";
const LANGS = ["en", "pt"];

const initialLang = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (LANGS.includes(saved)) return saved;
    } catch {
        // storage blocked: fall back to the browser language
    }
    return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
};

const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: strings.en });

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(initialLang);

    useEffect(() => {
        document.documentElement.lang = lang === "pt" ? "pt-PT" : "en";
        document.title = strings[lang].meta.title;
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // nothing to do, the choice just won't be remembered
        }
    }, [lang]);

    const value = useMemo(() => ({ lang, setLang, t: strings[lang] }), [lang]);
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// { lang, setLang, t }: t holds every interface text in the current language
export const useLang = () => useContext(LanguageContext);
