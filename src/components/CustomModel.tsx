"use client";

import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// ══════════════════════════════════════════════════════════════
//  3D Model — just the GLB model + drop-in animation
//  No projectors, no Leva. Pure production component.
// ══════════════════════════════════════════════════════════════

// ── Timing ──
export const MODEL_DROP_SPEED = 10.0;  // Higher = faster drop
export const MODEL_START_Y = 7;       // How high above it starts
export const MODEL_TARGET_Y = 2.03;   // Final resting position

interface CustomModelProps {
    animationPhase: number;
    setAnimationPhase: (phase: number | ((prev: number) => number)) => void;
}

export default function CustomModel({ animationPhase, setAnimationPhase }: CustomModelProps) {
    const { scene } = useGLTF("/3DAsset/Meshy_AI_Neon_Screen_Cube_compressed.glb", "/draco/");

    const groupRef = useRef<THREE.Group>(null!);
    const animDone = useRef(false);

    useFrame((_, delta) => {
        if (animationPhase < 0) return;
        if (animDone.current || !groupRef.current) return;

        const currentY = groupRef.current.position.y;
        const newY = THREE.MathUtils.lerp(currentY, MODEL_TARGET_Y, 1 - Math.exp(-MODEL_DROP_SPEED * Math.min(delta, 0.1)));
        groupRef.current.position.y = newY;

        if (Math.abs(newY - MODEL_TARGET_Y) < 0.005) {
            groupRef.current.position.y = MODEL_TARGET_Y;
            animDone.current = true;
            // Phase 0 → 1: model landed, screens can start
            setAnimationPhase((p: number) => Math.max(p, 1));
        }
    });

    // Fluid scaling logic
    const [scale, setScale] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            // Fluid scale between 320px (scale 2.8) and 1440px (scale 4.0)
            const minW = 320;
            const maxW = 1440;
            const t = Math.max(0, Math.min(1, (width - minW) / (maxW - minW)));
            const fluidScale = 2.8 + t * 1.2;
            setScale(fluidScale);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <group ref={groupRef} position={[0, MODEL_START_Y, 0]} rotation={[-3.10, 0.52, -3.07]}>
            <primitive object={scene} scale={scale} position={[0, 0, 0]} />

            {/* Lights to illuminate the 3D model */}
            <ambientLight intensity={0.8} color="#ffffff" />
            <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-5, 3, -3]} intensity={0.8} color="#88ffaa" />
        </group>
    );
}

useGLTF.preload("/3DAsset/Meshy_AI_Neon_Screen_Cube_compressed.glb", "/draco/");
