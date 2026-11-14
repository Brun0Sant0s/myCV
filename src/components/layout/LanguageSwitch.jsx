import { useLang } from "../../i18n/LanguageContext";

// EN / PT switch, fixed in the top right corner and styled like the tab bar.
const LanguageSwitch = () => {
    const { lang, setLang, t } = useLang();

    return (
        <div
            role="group"
            aria-label={t.nav.language}
            className="fixed z-40 top-[max(16px,env(safe-area-inset-top))] right-[max(16px,env(safe-area-inset-right))] flex rounded-xl border border-white/20 bg-[#0a0a0c]/90 backdrop-blur-md overflow-hidden font-mono text-[12px]"
        >
            {["en", "pt"].map((code) => {
                const on = code === lang;
                return (
                    <button
                        key={code}
                        type="button"
                        lang={code}
                        aria-pressed={on}
                        onClick={() => setLang(code)}
                        className={`relative px-3 py-2 uppercase border-r border-white/[0.08] last:border-r-0 transition-colors ${
                            on ? "bg-white/[0.07] text-white" : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]"
                        }`}
                    >
                        {on && <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#20C997]" />}
                        {code}
                    </button>
                );
            })}
        </div>
    );
};

export default LanguageSwitch;
