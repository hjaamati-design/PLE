"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

export default function Footer({ visible = false }: { visible?: boolean }) {
    return (
        <motion.footer
            className="w-full pt-12 pb-8 flex flex-col pt-8 z-10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
        >
            <div className="footer-bottom">
                <div>© 2026 PLE Events. Tous droits réservés.</div>
                <div className="social-links">
                    <a
                        href="https://www.instagram.com/partenaire.event/"
                        aria-label="Instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Instagram size={18} />
                    </a>
                </div>
            </div>
        </motion.footer>
    );
}

