"use client";

import { useControls, button } from "leva";

/**
 * ── Mobile Rig Editor (Development Only) ──
 * Live Leva controls for tuning the 3D rig's Y position and scale.
 * Returns the current values so Scene.tsx can apply them to the model group.
 *
 * Usage: const { rigY, rigScale } = useMobileRigEditor();
 * Then wrap CustomModel in <group position-y={rigY} scale={rigScale}>
 */

export function useMobileRigEditor() {
    const values = useControls("📱 Mobile Rig Tuner", {
        rigY: { value: 0, min: -10, max: 10, step: 0.05, label: "Rig Y Position" },
        rigScale: { value: 1, min: 0.5, max: 2, step: 0.05, label: "Rig Scale" },
        "Copy Values": button((get) => {
            const data = {
                rigY: get("📱 Mobile Rig Tuner.Rig Y Position"),
                rigScale: get("📱 Mobile Rig Tuner.Rig Scale"),
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                aspect: (window.innerWidth / window.innerHeight).toFixed(3),
            };
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            alert("📋 Rig config copied!\n\n" + JSON.stringify(data, null, 2));
        }),
    });

    return values;
}
