"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function SubscribeForm({ visible = false }: { visible?: boolean }) {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_NEWSLETTER_URL!;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            await fetch(APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
        } catch (err) {
            console.error("Newsletter subscription error:", err);
        } finally {
            setLoading(false);
            setSubmitted(true);
        }
    };

    const [margin, setMargin] = useState("-3rem");

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            // Fluidly move from -3rem (desktop) to 0rem (mobile)
            const t = Math.max(0, Math.min(1, (width - 480) / (1200 - 480)));
            const fluidMargin = -3 + t * 3; // in rem
            setMargin(`${fluidMargin}rem`);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: margin
            }}
        >
            {!submitted ? (
                loading ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="subscribe-form"
                        style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}
                    >
                        <motion.span
                            style={{
                                display: "block",
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                border: "3px solid var(--glass-border)",
                                borderTopColor: "var(--accent)",
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        />
                    </motion.div>
                ) : (
                <form onSubmit={handleSubmit} className="subscribe-form">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Entrez votre e-mail pour rester informé"
                        className="email-input"
                        required
                    />
                    <button type="submit" className="submit-button">
                        S'INSCRIRE <ArrowUpRight size={18} strokeWidth={3} />
                    </button>
                </form>
                )
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-4 text-center mb-12"
                    style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        backdropFilter: 'blur(12px)',
                        color: 'var(--accent)',
                        fontWeight: '600',
                        borderRadius: '8px'
                    }}
                >
                    Merci ! Nous vous contacterons dès le lancement.
                </motion.div>
            )}
        </motion.div>
    );
}
