import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { motion, useReducedMotion } from "framer-motion";
import { FiDownload } from "react-icons/fi";
import { ACCENT, EASE } from "../../constants/theme";

// EmailJS account used by the contact form (public key, safe to ship in the browser)
const PUBLIC_KEY = "Fm4CiN7G-6rOIWqQh";
const SERVICE_ID = "bruno_santos";
const TEMPLATE_ID = "template_zbxwdle";

const links = [
    { label: "Email", value: "bruno.santos.career@gmail.com", href: "mailto:bruno.santos.career@gmail.com" },
    { label: "Phone", value: "+351 918 432 080", href: "tel:+351918432080" },
    { label: "LinkedIn", value: "bruno-santos-a8560221a", href: "https://www.linkedin.com/in/bruno-santos-a8560221a/", external: true },
    { label: "GitHub", value: "brun0sant0s", href: "https://github.com/Brun0Sant0s", external: true },
];


const statusText = {
    success: { text: "Message sent. I'll get back to you soon.", className: "text-[#20C997]" },
    incomplete: { text: "Please fill in all fields.", className: "text-[#F5A524]" },
    error: { text: "The message could not be sent. Please email me directly.", className: "text-red-400" },
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
    const reduceMotion = useReducedMotion();
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

    const reveal = (delay = 0) =>
        reduceMotion
            ? {}
            : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.3 },
                  transition: { duration: 0.7, ease: EASE, delay },
              };

    // A prop whose value is an input the visitor fills in
    const inputProp = ({ n, name, prop, type = "text", placeholder, autoComplete, wide }) => (
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
                aria-label={prop}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className={`bg-transparent outline-none border-b border-dashed placeholder-[#5d636b] font-mono text-[11px] sm:text-[13px] ${
                    wide ? "w-[170px] sm:w-[280px]" : "w-[130px] sm:w-[210px]"
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
            className="relative w-full min-h-screen flex items-center justify-center bg-black text-white px-5 sm:px-8 pt-20 pb-32 sm:py-28"
        >
            <div className="mx-auto w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)_minmax(0,0.8fr)] gap-y-12 lg:gap-x-16 items-center text-left">
                {/* Left: invitation */}
                <motion.div className="flex flex-col lg:items-end lg:text-right" {...reveal()}>
                    <h3 className="font-montserrat font-semibold text-3xl sm:text-4xl leading-tight text-white">Let's talk</h3>
                    <p className="mt-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                        Frontend Engineer · Porto
                    </p>
                    <p className="mt-5 max-w-sm font-montserrat font-light text-[15px] text-gray-400 leading-relaxed">
                        Every value is a link. Or fill in the props with your name, email and message, and run it to send.
                    </p>
                    <a
                        href={`${import.meta.env.BASE_URL}documents/CV_BRUNO_EN.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-montserrat text-sm font-medium text-black transition-opacity duration-300 hover:opacity-85"
                    >
                        <FiDownload className="w-4 h-4" />
                        Download CV
                    </a>
                </motion.div>

                {/* Centre: the contact as a React component in an editor */}
                <motion.form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit(e);
                    }}
                    noValidate
                    className="min-w-0 rounded-2xl border border-white/20 bg-[#0b0b0d] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] font-mono text-[11px] sm:text-[13px]"
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
                            <span style={{ color: C.com }}>{"// your details"}</span>
                        </Line>
                        {inputProp({ n: 9, name: "name", prop: "from", placeholder: "your name", autoComplete: "name", })}
                        {inputProp({ n: 10, name: "email", prop: "replyTo", type: "email", placeholder: "you@email.com", autoComplete: "email", })}
                        {inputProp({ n: 11, name: "message", prop: "message", placeholder: "what are you working on?", wide: true, })}
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
                            {status ? (
                                <span className={statusText[status].className}>{statusText[status].text}</span>
                            ) : (
                                "// Ctrl + Enter or Run to send"
                            )}
                        </span>
                        <button
                            type="submit"
                            disabled={sending}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 font-montserrat text-sm font-medium text-black transition-opacity duration-300 hover:opacity-85 disabled:opacity-50"
                        >
                            {sending ? "Running…" : "Run ▸"}
                        </button>
                    </div>
                </motion.form>

                {/* Right: channels */}
                <motion.div {...reveal(0.15)}>
                    <p className="mb-5 font-montserrat text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">Channels</p>
                    <ul className="space-y-4">
                        {[
                            ["Email", "best for projects and roles"],
                            ["Phone", "call or WhatsApp"],
                            ["LinkedIn", "career and experience"],
                            ["GitHub", "code and side projects"],
                        ].map(([k, t]) => (
                            <li key={k} className="relative pl-4 font-montserrat font-light text-sm text-gray-300 leading-relaxed">
                                <span className="absolute left-0 top-[9px] w-[5px] h-[5px] rounded-full" style={{ background: ACCENT }} />
                                <a
                                    href={byLabel[k].href}
                                    {...(byLabel[k].external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                    className="font-semibold text-white hover:underline underline-offset-4"
                                >
                                    {k}
                                </a>
                                : {t}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default Contacts;
