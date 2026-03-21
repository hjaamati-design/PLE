"use client";

import { motion } from "framer-motion";

export default function HeroContent({ visible = false }: { visible?: boolean }) {
    return (
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <motion.h1
                className="headline"
                initial={{ opacity: 0, y: 30 }}
                animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0 }}
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
            >
                BIENTÔT DISPONIBLE
            </motion.h1>

            <motion.p
                className="subtitle"
                initial={{ opacity: 0, y: 30 }}
                animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontSize: '0.85rem',
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                    color: 'var(--foreground)',
                    opacity: 0.9
                }}
            >
                VOTRE PLATEFORME DE GESTION D'ÉVÉNEMENTS & LOCATION D'ÉQUIPEMENT ARRIVE.
            </motion.p>
        </div>
    );
}
