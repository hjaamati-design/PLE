"use client";

import * as THREE from "three";
import { useMemo, useRef, useEffect, useState } from "react";
import { SpotLight } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls, button } from "leva";
import { DESKTOP_PROJECTOR_CONFIGS, MOBILE_PROJECTOR_CONFIGS } from "./Projectors";

/**
 * ── Projector Editor (Development Only) ──
 * Provides Leva UI controls for positioning and tuning projectors.
 * Can be safely commented out in Scene.tsx without breaking the animation chain.
 * The projector rendering and phase animation are handled by CustomModel.tsx.
 */

// Volumetric Light with live Leva editing
function VolumetricBeamEditable({ config, ...props }: any) {
    const calculatedTarget = useMemo(() => {
        const center = new THREE.Vector3(0, 2, 0);
        const pos = new THREE.Vector3(config.x, config.y, config.z);
        const direction = pos.clone().sub(center).normalize();
        return pos.clone().add(direction.multiplyScalar(100));
    }, [config]);

    const [{ animation, beamColor, volume, angle, distance, penumbra, radiusTop, rayOpacity, attenuation, anglePower, originX, originY, originZ, targetX, targetY, targetZ }, setLeva] = useControls("Projector Editor", () => ({
        animation: { options: ["Static", "Sweep X", "Sweep Y", "Circle", "Pulse", "Strobe"] },
        beamColor: { value: '#ffff00', label: 'Color' },
        volume: { value: 100, min: 0, max: 3000, step: 10, label: "Volume (Brightness)" },
        angle: { value: 0.08, min: 0.01, max: 1.0, step: 0.01, label: "Thickness" },
        distance: { value: 150, min: 10, max: 500, step: 1, label: "Length" },
        penumbra: { value: 0.3, min: 0, max: 1, step: 0.1, label: "Softness" },
        radiusTop: { value: 0.1, min: 0, max: 2, step: 0.01, label: "Lens Radius" },
        rayOpacity: { value: 0.3, min: 0, max: 5, step: 0.1, label: "Ray Opacity" },
        attenuation: { value: 5, min: 0, max: 20, step: 0.1, label: "Ray Fade" },
        anglePower: { value: 3, min: 0, max: 20, step: 0.1, label: "Ray Focus" },
        originX: { value: config.x, min: -10, max: 10, step: 0.01 },
        originY: { value: config.y, min: -10, max: 10, step: 0.01 },
        originZ: { value: config.z, min: -10, max: 10, step: 0.01 },
        targetX: { value: calculatedTarget.x, min: -200, max: 200, step: 0.1 },
        targetY: { value: calculatedTarget.y, min: -200, max: 200, step: 0.1 },
        targetZ: { value: calculatedTarget.z, min: -200, max: 200, step: 0.1 },
        "Copy Settings": button((get) => {
            const data = {
                animation: get("Projector Editor.animation"),
                color: get("Projector Editor.beamColor"),
                volume: get("Projector Editor.volume"),
                angle: get("Projector Editor.angle"),
                distance: get("Projector Editor.distance"),
                penumbra: get("Projector Editor.penumbra"),
                radiusTop: get("Projector Editor.radiusTop"),
                rayOpacity: get("Projector Editor.rayOpacity"),
                attenuation: get("Projector Editor.attenuation"),
                anglePower: get("Projector Editor.anglePower"),
                origin: { x: get("Projector Editor.originX"), y: get("Projector Editor.originY"), z: get("Projector Editor.originZ") },
                target: { x: get("Projector Editor.targetX"), y: get("Projector Editor.targetY"), z: get("Projector Editor.targetZ") },
            };
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            alert("Copied Projector Settings to clipboard!");
        })
    }), [calculatedTarget]);

    useEffect(() => {
        setLeva({
            animation: config.animation ?? "Static",
            beamColor: config.color ?? '#ffff00',
            volume: config.volume ?? 800,
            angle: config.angle ?? 0.08,
            distance: config.distance ?? 150,
            penumbra: config.penumbra ?? 0.3,
            radiusTop: config.radiusTop ?? 0.1,
            rayOpacity: config.rayOpacity ?? 1,
            attenuation: config.attenuation ?? 5,
            anglePower: config.anglePower ?? 5,
            originX: config.x,
            originY: config.y,
            originZ: config.z,
            targetX: config.targetX ?? calculatedTarget.x,
            targetY: config.targetY ?? calculatedTarget.y,
            targetZ: config.targetZ ?? calculatedTarget.z,
        });
    }, [config, calculatedTarget, setLeva]);

    const originObj = useMemo(() => {
        const obj = new THREE.Object3D();
        obj.position.set(config.x, config.y, config.z);
        return obj;
    }, [config]);

    const targetObj = useMemo(() => {
        const obj = new THREE.Object3D();
        obj.position.copy(calculatedTarget);
        return obj;
    }, [calculatedTarget]);

    const [animMultiplier, setAnimMultiplier] = useState(1);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        let offsetX = 0, offsetY = 0, offsetZ = 0;

        switch (animation) {
            case "Sweep X": offsetX = Math.sin(time * 2) * 30; break;
            case "Sweep Y": offsetY = Math.sin(time * 2) * 30; break;
            case "Circle": offsetX = Math.cos(time * 2) * 20; offsetZ = Math.sin(time * 2) * 20; break;
        }

        originObj.position.set(originX as any, originY as any, originZ as any);
        targetObj.position.set((targetX as any) + offsetX, (targetY as any) + offsetY, (targetZ as any) + offsetZ);

        if (animation === "Pulse") {
            setAnimMultiplier(0.1 + 0.9 * Math.abs(Math.sin(time * 3)));
        } else if (animation === "Strobe") {
            setAnimMultiplier(Math.sin(time * 20) > 0 ? 1 : 0);
        } else if (animMultiplier !== 1) {
            setAnimMultiplier(1);
        }
    });

    return (
        <group>
            <primitive object={targetObj} />
            <primitive object={originObj} />
            <SpotLight
                position={[originX, originY, originZ]}
                target={targetObj}
                color={beamColor}
                intensity={volume * animMultiplier}
                angle={angle}
                penumbra={penumbra}
                distance={distance}
                radiusTop={radiusTop}
                attenuation={attenuation}
                anglePower={anglePower}
                opacity={rayOpacity * animMultiplier}
                castShadow={false}
                {...props}
            />
        </group>
    );
}

export default function ProjectorEditor() {
    const { profile, activeProjector } = useControls("Rig Settings", {
        profile: {
            value: "Desktop",
            options: ["Desktop", "Mobile"],
            label: "📱 Profile"
        },
        activeProjector: {
            value: 4,
            options: {
                "Projector 1": 0, "Projector 2": 1, "Projector 3": 2, "Projector 4": 3,
                "Projector 5": 4, "Projector 6": 5, "Projector 7": 6, "Projector 8": 7,
                "Projector 9": 8, "Projector 10": 9, "Projector 11": 10, "Projector 12": 11,
                "Projector 13": 12
            },
            label: "Select Projector"
        }
    });

    const configs = profile === "Mobile" ? MOBILE_PROJECTOR_CONFIGS : DESKTOP_PROJECTOR_CONFIGS;
    const config = configs[activeProjector] || configs[0];

    return (
        <group>
            {/* Editable overlay for the active projector */}
            <VolumetricBeamEditable config={config} />
        </group>
    );
}
