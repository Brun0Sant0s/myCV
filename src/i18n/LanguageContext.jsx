import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import strings from "./strings";

// The site speaks English or Portuguese.
// It always opens in English; only a language the visitor picks is remembered on this device.
// (New key: the old "lang" one also held languages picked automatically from the browser.)
const STORAGE_KEY = "site-lang";
const LANGS = ["en", "pt"];

const initialLang = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (LANGS.includes(saved)) return saved;
    } catch {
        // storage blocked: English
    }
    return "en";
};

const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: strings.en });

export const LanguageProvider = ({ children }) => {
    const [lang, setLangState] = useState(initialLang);

    const setLang = useCallback((next) => {
        setLangState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // nothing to do, the choice just won't be remembered
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang === "pt" ? "pt-PT" : "en";
        document.title = strings[lang].meta.title;
    }, [lang]);

    const value = useMemo(() => ({ lang, setLang, t: strings[lang] }), [lang, setLang]);
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// { lang, setLang, t }: t holds every interface text in the current language
export const useLang = () => useContext(LanguageContext);
