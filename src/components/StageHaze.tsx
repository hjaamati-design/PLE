"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// ══════════════════════════════════════════════════════════════
//  TIMING — Adjust these to control the haze
// ══════════════════════════════════════════════════════════════
export const HAZE_SPEED = 0.15;        // How fast the smoke drifts
export const HAZE_OPACITY = 0.08;      // Base opacity of each layer (subtle!)
export const HAZE_COLOR = "#1a4a1a";   // Green tint to match the grid/projectors

// ── Haze Layer ──
// A single animated fog plane with noise-based opacity
function HazeLayer({
    position,
    scale,
    speed,
    opacity,
    color,
    rotation,
}: {
    position: [number, number, number];
    scale: [number, number];
    speed: number;
    opacity: number;
    color: string;
    rotation?: [number, number, number];
}) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const matRef = useRef<THREE.ShaderMaterial>(null!);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uOpacity: { value: opacity },
            uColor: { value: new THREE.Color(color) },
        }),
        [opacity, color]
    );

    useFrame((state) => {
        if (matRef.current) {
            matRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed;
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            rotation={rotation || [0, 0, 0]}
        >
            <planeGeometry args={scale} />
            <shaderMaterial
                ref={matRef}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                vertexShader={`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `}
                fragmentShader={`
                    uniform float uTime;
                    uniform float uOpacity;
                    uniform vec3 uColor;
                    varying vec2 vUv;

                    // Simplex-style noise
                    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

                    float snoise(vec2 v) {
                        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                                           -0.577350269189626, 0.024390243902439);
                        vec2 i  = floor(v + dot(v, C.yy));
                        vec2 x0 = v - i + dot(i, C.xx);
                        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                        vec4 x12 = x0.xyxy + C.xxzz;
                        x12.xy -= i1;
                        i = mod289(i);
                        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                                       + i.x + vec3(0.0, i1.x, 1.0));
                        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                                                 dot(x12.zw, x12.zw)), 0.0);
                        m = m * m;
                        m = m * m;
                        vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
                        vec3 h = abs(x_) - 0.5;
                        vec3 ox = floor(x_ + 0.5);
                        vec3 a0 = x_ - ox;
                        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
                        vec3 g;
                        g.x = a0.x * x0.x + h.x * x0.y;
                        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                        return 130.0 * dot(m, g);
                    }

                    void main() {
                        // 2 octaves of noise instead of 3 for performance
                        float n1 = snoise(vUv * 3.0 + uTime * 0.3);
                        float n2 = snoise(vUv * 6.0 - uTime * 0.2) * 0.5;
                        float noise = (n1 + n2) * 0.6 + 0.4;

                        // Soft circular fade from center
                        float dist = length(vUv - 0.5) * 2.0;
                        float vignette = 1.0 - smoothstep(0.3, 1.0, dist);

                        // Combine
                        float alpha = noise * vignette * uOpacity;

                        gl_FragColor = vec4(uColor, alpha);
                    }
                `}
            />
        </mesh>
    );
}

// ══════════════════════════════════════════════════════════════
//  Stage Haze — Layered volumetric fog for concert ambiance
//  Add to Scene.tsx: <StageHaze />
// ══════════════════════════════════════════════════════════════
export default function StageHaze() {
    return (
        <group>
            {/* Back layer — wide, slow drift */}
            <HazeLayer
                position={[0, 0, -14]}
                scale={[50, 25]}
                speed={HAZE_SPEED * 0.6}
                opacity={HAZE_OPACITY}
                color={HAZE_COLOR}
            />

            {/* Mid layer — medium, slightly faster */}
            <HazeLayer
                position={[-2, -1, -10]}
                scale={[35, 18]}
                speed={HAZE_SPEED}
                opacity={HAZE_OPACITY * 0.7}
                color="#0a3a0a"
                rotation={[0, 0.2, 0]}
            />

            {/* Low ground haze — hugs the floor, behind model */}
            <HazeLayer
                position={[0, -3, -6]}
                scale={[35, 20]}
                speed={HAZE_SPEED * 0.4}
                opacity={HAZE_OPACITY * 0.8}
                color="#0d2d0d"
                rotation={[-Math.PI / 2, 0, 0]}
            />

            {/* Front subtle layer — very thin, just for depth */}
            <HazeLayer
                position={[3, 1, 10]}
                scale={[25, 12]}
                speed={HAZE_SPEED * 1.4}
                opacity={HAZE_OPACITY * 0.25}
                color="#1a4a1a"
                rotation={[0, -0.15, 0]}
            />

            {/* Upper atmosphere — very subtle, high up behind */}
            <HazeLayer
                position={[0, 6, -8]}
                scale={[30, 15]}
                speed={HAZE_SPEED * 0.3}
                opacity={HAZE_OPACITY * 0.5}
                color="#0a2a0a"
                rotation={[-0.3, 0, 0]}
            />
        </group>
    );
}
