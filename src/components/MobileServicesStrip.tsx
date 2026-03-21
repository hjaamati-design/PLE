"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, Lightbulb, Tent, Volume2, Truck, BoxSelect } from "lucide-react";

export default function MobileServicesStrip({ visible = false }: { visible?: boolean }) {
    const cards = [
        {
            icon: <CalendarCheck2 size={24} strokeWidth={1.5} />,
            title: "Events",
            desc: "Planification",
            info: "Conception et organisation sur mesure de vos soirées et galas."
        },
        {
            icon: <Volume2 size={24} strokeWidth={1.5} />,
            title: "Audio",
            desc: "Son",
            info: "Systèmes de sonorisation professionnels pour tout type d'événement."
        },
        {
            icon: <Lightbulb size={24} strokeWidth={1.5} />,
            title: "Lighting",
            desc: "Éclairage",
            info: "Mise en lumière architecturale et scénique spectaculaire."
        },
        {
            icon: <Truck size={24} strokeWidth={1.5} />,
            title: "Logistics",
            desc: "Logistique",
            info: "Installation, transport et gestion technique complète."
        },
        {
            icon: <Tent size={24} strokeWidth={1.5} />,
            title: "Chapiteaux",
            desc: "Structures",
            info: "Solutions d'abris élégants et robustes pour tous vos événements."
        },
        {
            icon: <BoxSelect size={24} strokeWidth={1.5} />,
            title: "Structure Truss",
            desc: "Scénographie",
            info: "Systèmes de structures modulaires pour éclairage et supports scéniques."
        },
    ];

    return (
        <motion.div
            className="mobile-services-strip"
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
        >
            <div className="mobile-services-scroll">
                {cards.map((card, index) => (
                    <div key={index} className="mobile-service-card">
                        <div className="mobile-service-header">
                            <div className="mobile-service-icon">
                                {card.icon}
                            </div>
                            <div className="mobile-service-titles">
                                <h3>{card.title}</h3>
                                <span className="mobile-service-subtitle">{card.desc}</span>
                            </div>
                        </div>
                        <p className="mobile-service-info">{card.info}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
