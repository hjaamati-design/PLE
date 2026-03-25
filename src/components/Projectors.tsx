"use client";

import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import { SpotLight } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// ══════════════════════════════════════════════════════════════
//  PROJECTOR DATA
//  The exact 13 projector coordinates (World Space)
// ══════════════════════════════════════════════════════════════
// ── Desktop Projector Configs ──
export const DESKTOP_PROJECTOR_CONFIGS: any[] = [
    {
        // Projector 1 (index 0)
        animation: "Static", color: "#c2ff00", volume: 450, angle: 0.22999999999999998, distance: 10, penumbra: 0.4,
        radiusTop: 0.12000000000000001, rayOpacity: 0.5, attenuation: 5.6, anglePower: 6,
        x: -3.77, y: 0.8, z: 2,
        targetX: -88.81093530505785, targetY: -46.06873272309536, targetZ: 47.114554538492236
    },
    {
        // Projector 2 (index 1)
        animation: "Static", color: "#c2ff00", volume: 450, angle: 0.22999999999999998, distance: 10, penumbra: 0.4,
        radiusTop: 0.12000000000000001, rayOpacity: 0.5, attenuation: 5.6, anglePower: 6,
        x: -1.3199999999999996, y: -0.0799999999999998, z: 4.5099999999999785,
        targetX: -47.88737805935077, targetY: -68.50902290947353, targetZ: 58.757519091227934
    },
    { x: -0.15, y: -1.09, z: 2.00 }, // Projector 3
    {
        // Projector 4 (index 3)
        animation: "Static", color: "#c2ff00", volume: 450, angle: 0.14, distance: 10, penumbra: 0.09999999999999998,
        radiusTop: 0.18, rayOpacity: 0.5, attenuation: 3, anglePower: 2.3,
        x: 1.14, y: 0.3899999999999896, z: 3.869999999999983,
        targetX: -4.4502718789842755, targetY: -352.1940718695401, targetZ: 67.77737499409744
    },
    {
        // Projector 5 (index 4)
        animation: "Static", color: "#c2ff00", volume: 760, angle: 0.26, distance: 10, penumbra: 0.5,
        radiusTop: 0.18, rayOpacity: 1, attenuation: 7.8, anglePower: 2.5999999999999996,
        x: 1.73, y: 1.79, z: 4.38,
        targetX: 70.5, targetY: -5, targetZ: 44.2
    },
    { x: -2.60, y: -0.71, z: 2.00 },
    { x: -1.74, y: 3.26, z: 2.00 },
    { x: -0.29, y: 3.23, z: 2.00 },
    {
        // Projector 9 (index 8)
        animation: "Static", color: "#c2ff00", volume: 1020, angle: 0.22000000000000003, distance: 10, penumbra: 0.3,
        radiusTop: 0.12000000000000001, rayOpacity: 1, attenuation: 5, anglePower: 5,
        x: 2.890000000000001, y: -0.35999999999999993, z: 2,
        targetX: 70.34897389681038, targetY: -27.104104809321772, targetZ: 48.63411187495587
    },
    {
        // Projector 10 (index 9)
        animation: "Static", color: "#c2ff00", volume: 1440, angle: 0.61, distance: 150, penumbra: 0.3,
        radiusTop: 0.16, rayOpacity: 1, attenuation: 4.1, anglePower: 5,
        x: 2.940000000000001, y: 0.85, z: 1.9499999999999995,
        targetX: 82.3679528401615, targetY: -28.404277894019344, targetZ: 55.28050526185335
    },
    {
        // Projector 11 (index 10)
        animation: "Static", color: "#c2ff00", volume: 760, angle: 1, distance: 86, penumbra: 0.3,
        radiusTop: 0.1, rayOpacity: 1, attenuation: 4.3, anglePower: 4.5,
        x: -2.6800000000000104, y: 2.9699999999999998, z: 3.5099999999999936,
        targetX: -79.45626012135438, targetY: -53.00524165398929, targetZ: 53.74180991564222
    },
    { x: 2.67, y: 3.45, z: 2.00 },
    { x: 3.97, y: 1.80, z: 2.00 },
];

// ── Mobile Projector Configs (tune independently via editor) ──
export const MOBILE_PROJECTOR_CONFIGS: any[] = [
    { x: -3.77, y: 0.8, z: 2 }, // Projector 1 (disabled for mobile)
    {
        // Projector 2
        animation: "Static", color: "#c2ff00", volume: 450, angle: 0.22999999999999998, distance: 10, penumbra: 0.4,
        radiusTop: 0.12000000000000001, rayOpacity: 1.9, attenuation: 5.6, anglePower: 6,
        x: -1.02, y: -0.0799999999999998, z: 4.5099999999999785,
        targetX: -47.88737805935077, targetY: -68.50902290947353, targetZ: 58.757519091227934
    },
    {
        // Projector 3
        animation: "Static", color: "#c2ff00", volume: 1300, angle: 0.19, distance: 84, penumbra: 0.3,
        radiusTop: 0.060000000000000005, rayOpacity: 1, attenuation: 1.4, anglePower: 5,
        x: -0.06, y: -1.21, z: 10,
        targetX: -11.92184965569546, targetY: -33.37010290732649, targetZ: 12.391328742606134
    },
    {
        // Projector 4
        animation: "Static", color: "#c2ff00", volume: 450, angle: 0.14, distance: 10, penumbra: 0.09999999999999998,
        radiusTop: 0.1, rayOpacity: 0.5, attenuation: 3, anglePower: 2.3,
        x: 0.7499999999999999, y: 0.6499999999999896, z: 3.869999999999983,
        targetX: -4.4502718789842755, targetY: -200, targetZ: 67.77737499409744
    },
    { x: 1.73, y: 1.79, z: 4.38 }, // Projector 5 (disabled for mobile)
    {
        // Projector 6
        animation: "Static", color: "#c2ff00", volume: 800, angle: 0.08, distance: 150, penumbra: 0.3,
        radiusTop: 0.14, rayOpacity: 2.4000000000000004, attenuation: 3.7, anglePower: 3.7,
        x: -1.8, y: -0.11, z: 2,
        targetX: -63.70614384418214, targetY: -64.40140377605138, targetZ: 49.00472603398626
    },
    { x: -1.74, y: 3.26, z: 2.00 }, // Projector 7 (disabled for mobile)
    { x: -0.29, y: 3.23, z: 2.00 }, // Projector 8 (disabled for mobile)
    { x: 2.89, y: -0.36, z: 2.00 }, // Projector 9 (disabled for mobile)
    { x: 2.94, y: 0.85, z: 1.95 },  // Projector 10 (disabled for mobile)
    { x: -2.68, y: 2.97, z: 3.51 }, // Projector 11 (disabled for mobile)
    { x: 2.67, y: 3.45, z: 2.00 },  // Projector 12 (disabled for mobile)
    { x: 3.97, y: 1.80, z: 2.00 },  // Projector 13 (disabled for mobile)
];

// Backwards compatibility alias
export const PROJECTOR_CONFIGS = DESKTOP_PROJECTOR_CONFIGS;

// ══════════════════════════════════════════════════════════════
//  TIMING — Adjust these to control the projector sequence
// ══════════════════════════════════════════════════════════════
export const PROJECTOR_STAGGER = 0.3;       // dramatic pause between projectors in same group
export const PROJECTOR_FADE_DURATION = 0.6; // seconds for each projector to fade in
export const PROJECTOR_READING_DELAY = 1.0; // seconds to let users read cards before next group

// ══════════════════════════════════════════════════════════════
//  PHASE GROUPS — Which projectors activate at which phase
// ══════════════════════════════════════════════════════════════
/**
 *   Phase 2 → Projectors 5 & 10 → advance to phase 3 (right cards)
 *   Phase 3 → Right cards visible → reading delay → advance to phase 4
 *   Phase 4 → Projectors 11 & 1 → advance to phase 5 (left cards)
 *   Phase 5 → Left cards visible → reading delay → advance to phase 6
 *   Phase 6 → Projectors 2 & 4 → advance to phase 7 (text + footer)
 */
export const DESKTOP_PROJECTOR_GROUPS: { phase: number; indices: number[] }[] = [
    { phase: 2, indices: [4, 8] },   // Projectors 5 & 9
    { phase: 4, indices: [10, 0] },  // Projectors 11 & 1
    { phase: 6, indices: [1, 3] },   // Projectors 2 & 4
];

export const MOBILE_PROJECTOR_GROUPS: { phase: number; indices: number[] }[] = [
    { phase: 2, indices: [5] },      // Projector 6
    { phase: 4, indices: [2] },      // Projector 3
    { phase: 6, indices: [1, 3] },   // Projectors 2 & 4
];

// Backwards compatibility alias
export const PROJECTOR_GROUPS = DESKTOP_PROJECTOR_GROUPS;

// Returns which phase a projector belongs to (or -1 if not in any group)
function getProjectorPhase(index: number, isMobile = false): number {
    const groups = isMobile ? MOBILE_PROJECTOR_GROUPS : DESKTOP_PROJECTOR_GROUPS;
    for (const g of groups) {
        if (g.indices.includes(index)) return g.phase;
    }
    return -1;
}

// Returns the stagger order within its group (0 = first, 1 = second)
function getProjectorOrder(index: number, isMobile = false): number {
    const groups = isMobile ? MOBILE_PROJECTOR_GROUPS : DESKTOP_PROJECTOR_GROUPS;
    for (const g of groups) {
        const pos = g.indices.indexOf(index);
        if (pos !== -1) return pos;
    }
    return 0;
}

// ══════════════════════════════════════════════════════════════
//  Volumetric Beam Renderer (no Leva, production-ready)
// ══════════════════════════════════════════════════════════════
function VolumetricBeamConfigured({ config, animationPhase, ...props }: any) {
    const originObj = useMemo(() => {
        const obj = new THREE.Object3D();
        obj.position.set(config.x, config.y, config.z);
        return obj;
    }, [config]);

    const targetObj = useMemo(() => {
        const obj = new THREE.Object3D();
        obj.position.set(config.targetX, config.targetY, config.targetZ);
        return obj;
    }, [config]);

    const [animMultiplier, setAnimMultiplier] = useState(1);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        let offsetX = 0, offsetY = 0, offsetZ = 0;

        const currentAnim = animationPhase >= 7 ? "Circle" : config.animation;

        switch (currentAnim) {
            case "Sweep X": offsetX = Math.sin(time * 2) * 30; break;
            case "Sweep Y": offsetY = Math.sin(time * 2) * 30; break;
            case "Circle": offsetX = Math.cos(time * 2) * 20; offsetZ = Math.sin(time * 2) * 20; break;
        }

        originObj.position.set(config.x, config.y, config.z);
        targetObj.position.set(config.targetX + offsetX, config.targetY + offsetY, config.targetZ + offsetZ);

        if (currentAnim === "Pulse") {
            setAnimMultiplier(0.1 + 0.9 * Math.abs(Math.sin(time * 3)));
        } else if (currentAnim === "Strobe") {
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
                position={[config.x, config.y, config.z]}
                target={targetObj}
                color={config.color}
                intensity={config.volume * animMultiplier}
                angle={config.angle}
                penumbra={config.penumbra}
                distance={config.distance}
                radiusTop={config.radiusTop}
                attenuation={config.attenuation}
                anglePower={config.anglePower}
                opacity={config.rayOpacity * animMultiplier}
                castShadow={false}
                {...props}
            />
        </group>
    );
}

// ══════════════════════════════════════════════════════════════
//  Projectors Component — renders all projectors with phase animation
//  Drives the animation chain: phases 2→3, 4→5, 6→7 + reading delays
//
//  Instead of fading intensity via refs (drei SpotLight ignores that),
//  we DELAY MOUNTING each projector based on its stagger position.
//  The first projector in a pair mounts immediately, the second mounts
//  after PROJECTOR_STAGGER seconds.
// ══════════════════════════════════════════════════════════════
interface ProjectorsProps {
    animationPhase: number;
    setAnimationPhase: (phase: number | ((prev: number) => number)) => void;
}

export default function Projectors({ animationPhase, setAnimationPhase, isMobile = false }: ProjectorsProps & { isMobile?: boolean }) {
    const configs = isMobile ? MOBILE_PROJECTOR_CONFIGS : DESKTOP_PROJECTOR_CONFIGS;
    // Track which individual projectors have been activated (mounted)
    const [activatedProjectors, setActivatedProjectors] = useState<Set<number>>(new Set());
    const groupStartTimes = useRef<Map<number, number>>(new Map());
    const advancedPhases = useRef<Set<number>>(new Set());

    // Activate projectors one at a time based on stagger timing
    useFrame((state) => {
        let needsUpdate = false;
        const newActivated = new Set(activatedProjectors);
        const activeGroups = isMobile ? MOBILE_PROJECTOR_GROUPS : DESKTOP_PROJECTOR_GROUPS;

        for (const group of activeGroups) {
            if (animationPhase < group.phase) continue;

            // Record when this phase group started
            if (!groupStartTimes.current.has(group.phase)) {
                groupStartTimes.current.set(group.phase, state.clock.elapsedTime);
            }

            const groupStart = groupStartTimes.current.get(group.phase)!;
            const elapsed = state.clock.elapsedTime - groupStart;

            group.indices.forEach((projIdx, order) => {
                const activationTime = order * PROJECTOR_STAGGER;
                if (elapsed >= activationTime && !newActivated.has(projIdx)) {
                    newActivated.add(projIdx);
                    needsUpdate = true;
                }
            });

            // Advance to next phase when ALL projectors in the group are mounted
            // (last one mounts at STAGGER, so total wait = STAGGER + small buffer)
            if (!advancedPhases.current.has(group.phase)) {
                const allMounted = group.indices.every(idx => newActivated.has(idx));
                const lastOrder = group.indices.length - 1;
                const totalGroupTime = lastOrder * PROJECTOR_STAGGER + PROJECTOR_FADE_DURATION;
                if (allMounted && elapsed >= totalGroupTime) {
                    advancedPhases.current.add(group.phase);
                    setAnimationPhase((p: number) => Math.max(p, group.phase + 1));
                }
            }
        }

        if (needsUpdate) {
            setActivatedProjectors(newActivated);
        }
    });

    // ── Reading delay timers ──
    const readingDelayStarts = useRef<Map<number, number>>(new Map());
    const readingDelaysCompleted = useRef<Set<number>>(new Set());

    useFrame((state) => {
        const readingPhases = [3, 5];
        for (const rp of readingPhases) {
            if (animationPhase < rp) continue;
            if (readingDelaysCompleted.current.has(rp)) continue;

            if (!readingDelayStarts.current.has(rp)) {
                readingDelayStarts.current.set(rp, state.clock.elapsedTime);
            }

            const elapsed = state.clock.elapsedTime - readingDelayStarts.current.get(rp)!;
            if (elapsed >= PROJECTOR_READING_DELAY) {
                readingDelaysCompleted.current.add(rp);
                setAnimationPhase((p: number) => Math.max(p, rp + 1));
            }
        }
    });

    return (
        <group>
            {configs.map((p, i) => {
                // Only render configured projectors that have been activated
                if (!p.targetX) return null;
                if (!activatedProjectors.has(i)) return null;

                return (
                    <VolumetricBeamConfigured
                        key={`proj_${i}`}
                        config={p}
                        animationPhase={animationPhase}
                    />
                );
            })}
        </group>
    );
}
