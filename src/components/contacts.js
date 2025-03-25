import { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { FiUser, FiMail, FiMessageSquare, FiPhone, FiDownload } from "react-icons/fi";

// EmailJS configs
const PUBLIC_KEY = "Fm4CiN7G-6rOIWqQh";
const SERVICE_ID = "bruno_santos";
const TEMPLATE_ID = "template_zbxwdle";

const ContactsContent = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [focusedField, setFocusedField] = useState(null);
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState({ name: "", email: "", message: "" });

    useEffect(() => {
        emailjs.init(PUBLIC_KEY);
    }, []);


    useEffect(() => {
        if (Object.values(errors).some(err => err !== "")) {
            const timeout = setTimeout(() => {
                setErrors({ name: "", email: "", message: "" });
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [errors]);

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

    const handleFocus = (field) => setFocusedField(field);
    const handleBlur = () => setFocusedField(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus(null);

        const newErrors = {
            name: formData.name.trim() === "" ? "Name is required." : "",
            email: formData.email.trim() === "" ? "Email is required." : "",
            message: formData.message.trim() === "" ? "Message is required." : "",
        };
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((error) => error !== "");
        if (hasErrors) {
            setStatus("incomplete");
            return;
        }

        emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            name: formData.name,
            email: formData.email,
            message: formData.message,
        })
            .then(() => {
                setStatus("success");
                setFormData({ name: "", email: "", message: "" });
                setErrors({});
            })
            .catch((err) => {
                console.error("Erro ao enviar email:", err);
                setStatus("error");
            });
    };

    return (
        <div
            id="contactsContent"
            className="relative w-full flex flex-col items-center justify-center min-h-screen font-montserrat bg-black"
        >
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10 p-6">
                <form onSubmit={handleSubmit} className="relative w-full md:w-2/3 shadow-xl p-6">
                    <div className="flex w-full gap-10">
                        <div className="w-1/2 flex flex-col gap-4">
                            <div className="relative flex flex-col min-h-[80px]">
                                <div className="flex items-center h-16 border-b border-gray-500 focus-within:border-white">
                                    <FiUser className={`mr-2 ${focusedField === "name" ? "text-white" : "text-gray-400"}`} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus("name")}
                                        onBlur={handleBlur}
                                        placeholder="Your name"
                                        className="w-full bg-transparent text-white outline-none placeholder-gray-500 h-full"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="absolute text-red-500 text-sm mt-1 top-[68px]">{errors.name}</p>
                                )}
                            </div>

                            <div className="relative flex flex-col min-h-[80px]">
                                <div className="flex items-center h-16 border-b border-gray-500 focus-within:border-white">
                                    <FiMail className={`mr-2 ${focusedField === "email" ? "text-white" : "text-gray-400"}`} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus("email")}
                                        onBlur={handleBlur}
                                        placeholder="Your email"
                                        className="w-full bg-transparent text-white outline-none placeholder-gray-500 h-full"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="absolute text-red-500 text-sm mt-1 top-[68px]">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="relative flex flex-col min-h-[100px] w-1/2">
                            <div className="flex items-start h-40 border-b border-gray-500 focus-within:border-white pt-6">
                                <FiMessageSquare className={`mr-2 mt-1 ${focusedField === "message" ? "text-white" : "text-gray-400"}`} />
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus("message")}
                                    onBlur={handleBlur}
                                    placeholder="Your message"
                                    rows="4"
                                    className="w-full bg-transparent text-white outline-none placeholder-gray-500 h-full"
                                ></textarea>
                            </div>
                            {errors.message && (
                                <p className="absolute text-red-500 text-sm mt-1 top-[165px]">{errors.message}</p>
                            )}
                        </div>
                    </div>

                    {status === "success" && (
                        <p className="absolute text-green-400 text-sm top-[60%] mt-2">
                            Message sent successfully!
                        </p>
                    )}
                    {status === "error" && (
                        <p className="absolute text-red-500 text-sm top-[60%] mt-2">
                            Failed to send message. Please call me or send email to: bruno.santos.career@gmail.com.
                        </p>
                    )}


                    <div className="relative mt-10 p-[1px] rounded-md bg-gradient-to-r from-[#00BFFF] to-[#20C997] w-fit">
                        <button
                            type="submit"
                            className="relative text-white bg-black rounded-md px-6 py-3 text-m w-full h-full hover:bg-black/80 transition duration-300 ease-in-out"
                        >
                            Send Message
                        </button>
                    </div>
                </form>

                <div className="w-px bg-gradient-to-b from-[#00BFFF] to-[#20C997]" />

                <div className="w-full md:w-1/3 p-6 rounded-2xl flex flex-col justify-center items-center text-center min-h-[200px]">
                    <div className="flex-1 flex flex-col justify-center items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FiPhone className="text-white text-xl" />
                            <h3 className="text-lg text-white">Call me:</h3>
                        </div>
                        <p className="text-lg text-white underline-offset-2 hover:underline cursor-pointer">
                            <a href="tel:+351918432080">+351 918432080</a>
                        </p>
                    </div>

                    <div className="mt-10 p-[1px] rounded-md bg-gradient-to-r from-[#00BFFF] to-[#20C997] w-fit text-sm">
                        <a href={`${process.env.PUBLIC_URL}/documents/CV_Bruno_EN.pdf`}
                        target="_blank"
                            rel="noopener noreferrer"
                            className="relative text-white bg-black rounded-md px-6 py-3 flex items-center gap-2 hover:bg-black/80 transition duration-300 ease-in-out text-m"
                        >
                            <FiDownload className="w-5 h-5 text-sm" />
                            Download CV
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactsContent;
