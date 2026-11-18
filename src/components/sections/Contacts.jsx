import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiChevronRight, FiDownload, FiGithub, FiLinkedin, FiMail, FiPhone } from "react-icons/fi";
import { ACCENT } from "../../constants/theme";
import useReveal from "../../hooks/useReveal";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useLang } from "../../i18n/LanguageContext";

// EmailJS account used by the contact form (public key, safe to ship in the browser)
const PUBLIC_KEY = "Fm4CiN7G-6rOIWqQh";
const SERVICE_ID = "bruno_santos";
const TEMPLATE_ID = "template_zbxwdle";

const links = [
    { label: "Email", value: "bruno.santos.career@gmail.com", href: "mailto:bruno.santos.career@gmail.com", Icon: FiMail },
    { label: "Phone", value: "+351 918 432 080", href: "tel:+351918432080", Icon: FiPhone },
    { label: "LinkedIn", value: "bruno-santos-a8560221a", href: "https://www.linkedin.com/in/bruno-santos-a8560221a/", external: true, Icon: FiLinkedin },
    { label: "GitHub", value: "brun0sant0s", href: "https://github.com/Brun0Sant0s", external: true, Icon: FiGithub },
];

// Colour of each form status; the text comes from the translations (contacts.status)
const statusClass = {
    success: "text-[#20C997]",
    incomplete: "text-[#F5A524]",
    error: "text-red-400",
};

// Syntax colours of the editor (Material-style palette on the dark site)
const C = { kw: "#c792ea", tag: "#f07178", attr: "#ffcb6b", str: "#c3e88d", fn: "#82aaff", pn: "#89ddff", com: "#5d636b" };

// A line of the editor with its number
const Line = ({ n, children }) => (
    <div className="flex whitespace-pre">
        <span className="w-7 sm:w-9 shrink-0 pr-3 sm:pr-4 text-right text-[#3a3d42] select-none">{n}</span>
        <span className="min-w-0">{children}</span>
    </div>
);

// A prop whose value is a real link
const LinkProp = ({ n, name, l }) => (
    <Line n={n}>
        {"      "}
        <span style={{ color: C.attr }}>{name}</span>
        <span style={{ color: C.pn }}>=</span>
        <a
            href={l.href}
            {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="border-b border-dashed border-[#c3e88d]/40 hover:border-[#c3e88d] transition-colors"
            style={{ color: C.str }}
        >
            "{l.value}"
        </a>
    </Line>
);

const Contacts = () => {
    const { t } = useLang();
    const c = t.contacts;
    const reveal = useReveal({ y: 24, amount: 0.3 });
    const hasMouse = useMediaQuery("(pointer: fine)");
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState({ name: "", email: "", message: "" });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        emailjs.init({ publicKey: PUBLIC_KEY });
    }, []);

    useEffect(() => {
        if (status) {
            const timeout = setTimeout(() => setStatus(null), 5000);
            return () => clearTimeout(timeout);
        }
    }, [status]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus(null);

        const newErrors = {
            name: formData.name.trim() === "" ? "Name is required." : "",
            email: formData.email.trim() === "" ? "Email is required." : "",
            message: formData.message.trim() === "" ? "Message is required." : "",
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== "")) {
            setStatus("incomplete");
            return;
        }

        setSending(true);
        emailjs
            .send(SERVICE_ID, TEMPLATE_ID, {
                name: formData.name,
                email: formData.email,
                message: formData.message,
            })
            .then(() => {
                setStatus("success");
                setFormData({ name: "", email: "", message: "" });
                setErrors({ name: "", email: "", message: "" });
            })
            .catch((err) => {
                console.error("Contact form: email not sent", err);
                setStatus("error");
            })
            .finally(() => setSending(false));
    };

    // A prop whose value is an input the visitor fills in
    const inputProp = ({ n, name, prop, type = "text", placeholder, autoComplete, wide, enterKeyHint = "next" }) => (
        <Line n={n}>
            {"      "}
            <span style={{ color: C.attr }}>{prop}</span>
            <span style={{ color: C.pn }}>=</span>
            <span style={{ color: C.str }}>"</span>
            <input
                id={`contact-${name}`}
                name={name}
                type={type}
                autoComplete={autoComplete}
                enterKeyHint={enterKeyHint}
                autoCapitalize={type === "email" ? "none" : undefined}
                autoCorrect={type === "email" ? "off" : undefined}
                spellCheck={type === "email" ? false : undefined}
                aria-label={prop}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className={`bg-transparent outline-none border-b border-dashed placeholder-[#5d636b] font-mono text-base sm:text-[13px] ${
                    wide ? "w-[165px] sm:w-[280px]" : "w-[150px] sm:w-[210px]"
                } ${errors[name] ? "border-red-400/80" : "border-white/20 focus:border-[#c3e88d]"}`}
                style={{ color: C.str }}
            />
            <span style={{ color: C.str }}>"</span>
        </Line>
    );

    const byLabel = Object.fromEntries(links.map((l) => [l.label, l]));

    return (
        <div
            id="contactsContent"
            className="relative w-full lg:min-h-screen flex items-center justify-center bg-black text-white px-5 sm:px-8 pt-14 pb-36 sm:pt-24 lg:py-28"
        >
            <div className="mx-auto w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)_minmax(0,0.8fr)] gap-y-10 md:gap-y-12 md:gap-x-10 lg:gap-x-16 items-center text-left">
                {/* Left: invitation */}
                <motion.div className="order-1 flex flex-col lg:items-end lg:text-right" {...reveal()}>
                    <h3 className="font-montserrat font-semibold text-3xl sm:text-4xl leading-tight text-white">{c.title}</h3>
                    <p className="mt-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                        {c.tagline}
                    </p>
                    <p className="mt-5 max-w-sm font-montserrat font-light text-[15px] text-gray-400 leading-relaxed">{c.intro}</p>
                    <a
                        href={`${import.meta.env.BASE_URL}documents/${t.about.cv}?v=${import.meta.env.VITE_CV_VERSION}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tap mt-7 w-full md:w-auto md:self-start lg:self-end inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 lg:py-2.5 font-montserrat text-sm font-medium text-black hover:opacity-85"
                    >
                        <FiDownload className="w-4 h-4" />
                        {t.about.downloadCv}
                    </a>
                </motion.div>

                {/* Centre: the contact as a React component in an editor */}
                <motion.form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit(e);
                    }}
                    noValidate
                    className="order-3 lg:order-2 md:col-span-2 lg:col-span-1 min-w-0 rounded-2xl border border-white/20 bg-[#0b0b0d] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] font-mono text-[11px] sm:text-[13px]"
                    {...reveal(0.1)}
                >
                    <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                        <span className="ml-4 px-3 py-1 rounded-t-md bg-white/[0.06] text-xs text-white">Contact.jsx</span>
                        <span className="px-3 py-1 text-xs text-gray-600">App.jsx</span>
                    </div>

                    <div className="py-4 leading-[1.95] overflow-x-auto text-gray-300">
                        <Line n={1}>
                            <span style={{ color: C.kw }}>export default function</span> <span style={{ color: C.fn }}>Contact</span>
                            <span style={{ color: C.pn }}>() {"{"}</span>
                        </Line>
                        <Line n={2}>
                            {"  "}
                            <span style={{ color: C.kw }}>return</span> <span style={{ color: C.pn }}>(</span>
                        </Line>
                        <Line n={3}>
                            {"    "}
                            <span style={{ color: C.pn }}>&lt;</span>
                            <span style={{ color: C.tag }}>Bruno</span>
                        </Line>
                        <LinkProp n={4} name="email" l={byLabel.Email} />
                        <LinkProp n={5} name="phone" l={byLabel.Phone} />
                        <LinkProp n={6} name="linkedin" l={byLabel.LinkedIn} />
                        <LinkProp n={7} name="github" l={byLabel.GitHub} />
                        <Line n={8}>
                            {"      "}
                            <span style={{ color: C.com }}>{c.yourDetails}</span>
                        </Line>
                        {inputProp({ n: 9, name: "name", prop: "from", placeholder: c.placeholders.name, autoComplete: "name" })}
                        {inputProp({ n: 10, name: "email", prop: "replyTo", type: "email", placeholder: c.placeholders.email, autoComplete: "email" })}
                        {inputProp({ n: 11, name: "message", prop: "message", placeholder: c.placeholders.message, wide: true, enterKeyHint: "send" })}
                        <Line n={12}>
                            {"    "}
                            <span style={{ color: C.pn }}>/&gt;</span>
                        </Line>
                        <Line n={13}>
                            {"  "}
                            <span style={{ color: C.pn }}>);</span>
                        </Line>
                        <Line n={14}>
                            <span style={{ color: C.pn }}>{"}"}</span>
                        </Line>
                    </div>

                    {/* Run bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-white/10 bg-white/[0.02]">
                        <span className="text-xs" style={{ color: status ? undefined : C.com }}>
                            {status ? <span className={statusClass[status]}>{c.status[status]}</span> : hasMouse ? c.runHint : c.runHintTouch}
                        </span>
                        <button
                            type="submit"
                            disabled={sending}
                            className="tap inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 lg:px-4 lg:py-1.5 font-montserrat text-sm font-medium text-black hover:opacity-85 disabled:opacity-50"
                        >
                            {sending ? c.running : c.run}
                        </button>
                    </div>
                </motion.form>

                {/* Right: channels. Desktop: a short list. Phones and tablets: a grouped list of rows to tap, like a native contact card. */}
                <motion.div className="order-2 lg:order-3" {...reveal(0.15)}>
                    <p className="mb-4 lg:mb-5 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">{c.channelsTitle}</p>
                    <ul className="hidden lg:block space-y-4">
                        {Object.entries(c.channels).map(([k, [name, note]]) => (
                            <li key={k} className="relative pl-4 font-montserrat font-light text-sm lg:text-[15px] text-gray-300 leading-relaxed">
                                <span className="absolute left-0 top-[9px] w-[5px] h-[5px] rounded-full" style={{ background: ACCENT }} />
                                <a
                                    href={byLabel[k].href}
                                    {...(byLabel[k].external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                    className="font-semibold text-white hover:underline underline-offset-4"
                                >
                                    {name}
                                </a>
                                : {note}
                            </li>
                        ))}
                    </ul>
                    <ul className="lg:hidden rounded-2xl border border-white/[0.1] bg-white/[0.03] overflow-hidden divide-y divide-white/[0.07]">
                        {Object.entries(c.channels).map(([k, [name, note]]) => {
                            const l = byLabel[k];
                            const Trail = l.external ? FiArrowUpRight : FiChevronRight;
                            return (
                                <li key={k}>
                                    <a
                                        href={l.href}
                                        {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                        className="tap flex items-center gap-3.5 px-4 min-h-[64px] py-3 active:bg-white/[0.06]"
                                    >
                                        <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-[#20C997]/[0.12] text-[#20C997]">
                                            <l.Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-montserrat text-[15px] font-semibold text-white leading-tight">{name}</span>
                                            <span className="block mt-0.5 font-montserrat text-xs font-light text-gray-400 truncate">{note}</span>
                                        </span>
                                        <Trail className="w-[18px] h-[18px] shrink-0 text-gray-500" aria-hidden="true" />
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default Contacts;
