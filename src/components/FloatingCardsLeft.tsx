"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, Lightbulb, Tent } from "lucide-react";

export default function FloatingCardsLeft({ visible = false }: { visible?: boolean }) {
    const cards = [
        {
            icon: <CalendarCheck2 size={28} strokeWidth={1.5} />,
            title: "Events",
            desc: "Planification",
            info: "Conception et organisation sur mesure de vos soirées et galas."
        },
        {
            icon: <Lightbulb size={28} strokeWidth={1.5} />,
            title: "Lighting",
            desc: "Éclairage",
            info: "Mise en lumière architecturale et scénique spectaculaire."
        },
        {
            icon: <Tent size={28} strokeWidth={1.5} />,
            title: "Chapiteaux",
            desc: "Structures",
            info: "Solutions d'abris élégants et robustes pour tous vos événements."
        },
    ];

    return (
        <div className="floating-cards left">
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
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
