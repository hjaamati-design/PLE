"use client";

import { motion } from "framer-motion";
import { Volume2, Truck, BoxSelect } from "lucide-react";

export default function FloatingCards({ visible = false }: { visible?: boolean }) {
    const cards = [
        {
            icon: <Volume2 size={28} strokeWidth={1.5} />,
            title: "Audio",
            desc: "Son",
            info: "Systèmes de sonorisation professionnels pour tout type d'événement."
        },
        {
            icon: <Truck size={28} strokeWidth={1.5} />,
            title: "Logistics",
            desc: "Logistique",
            info: "Installation, transport et gestion technique complète."
        },
        {
            icon: <BoxSelect size={28} strokeWidth={1.5} />,
            title: "Structure Truss",
            desc: "Scénographie",
            info: "Systèmes de structures modulaires pour éclairage et supports scéniques."
        },
    ];

    return (
        <div className="floating-cards right">
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="floating-card center-aligned"
                >
                    <div className="floating-card-icon">
                        {card.icon}
                    </div>
                    <div className="floating-card-content">
                        <h3>{card.title}</h3>
                        <span className="floating-card-subtitle">{card.desc}</span>
                        <p>{card.info}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
