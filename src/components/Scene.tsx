"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useControls } from "leva";
import CustomModel from "./CustomModel";
import Projectors from "./Projectors";
import Screens from "./Screens";
import ScreenEditor from "./ScreenEditor";
import ProjectorEditor from "./ProjectorEditor";
// import { useMobileRigEditor } from "./CameraEditor"; // Dev only — uncomment to use Leva tuner
import StageHaze from "./StageHaze";

// ── Animated Grid ──
// Expands outward from center by animating fadeDistance
// Timing constants:
const GRID_EXPAND_DURATION = 2.0; // seconds for full reveal
const GRID_MAX_FADE = 30;         // final fadeDistance

function AnimatedGrid({ visible }: { visible: boolean }) {
    const gridRef = useRef<any>(null);
    const fadeRef = useRef(0);
    const startTime = useRef<number | null>(null);

    useFrame((state) => {
        if (!visible) {
            startTime.current = null;
            fadeRef.current = 0;
            return;
        }

        if (startTime.current === null) {
            startTime.current = state.clock.elapsedTime;
        }

        const elapsed = state.clock.elapsedTime - startTime.current;
        const progress = Math.min(1, elapsed / GRID_EXPAND_DURATION);
        // Ease-out quad for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 2);
        fadeRef.current = eased * GRID_MAX_FADE;

        // Update grid material uniform directly — no React re-render
        if (gridRef.current?.material?.uniforms?.fadeDistance) {
            gridRef.current.material.uniforms.fadeDistance.value = fadeRef.current;
        }
    });

    if (!visible) return null;

    return (
        <Grid
            ref={gridRef}
            position={[0, -4, 0]}
            args={[40, 40]}
            cellSize={1}
            cellThickness={1}
            cellColor="#004400"
            sectionSize={4}
            sectionThickness={1.5}
            sectionColor="#00FF00"
            fadeDistance={0}
            fadeStrength={1}
        />
    );
}

interface SceneProps {
    animationPhase: number;
    setAnimationPhase: (phase: number | ((prev: number) => number)) => void;
}

// ── Rig Wrapper (fluid Y + scale based on aspect ratio) ──
// Tuned values: at aspect 0.462 (428×926) → rigY=2.45, rigScale=0.85
// At aspect ≥ 1.0 (desktop) → rigY=0, rigScale=1.0
function RigWrapper({ animationPhase, setAnimationPhase }: SceneProps) {
    const [rig, setRig] = useState({ y: 0, scale: 1, isMobile: false });

    // Dev toggles to isolate what you're editing
    // const { showScreens, showProjectors } = useControls("🛠️ Dev Tools", {
    //     showScreens: { value: true, label: "Show All Screens" },
    //     showProjectors: { value: true, label: "Show All Projectors" },
    // });
    const showScreens = true;
    const showProjectors = true;

    useEffect(() => {
        const handleResize = () => {
            const aspect = window.innerWidth / window.innerHeight;
            const t = Math.max(0, Math.min(1, (1 - aspect) / 0.538));
            setRig({
                y: t * 2.45,
                scale: 1 - t * 0.15,
                isMobile: aspect < 1,
            });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <group position-y={rig.y} scale={rig.scale}>
            <Suspense fallback={null}>
                <CustomModel
                    animationPhase={animationPhase}
                    setAnimationPhase={setAnimationPhase}
                />
            </Suspense>

            <Suspense fallback={null}>
                {showProjectors && (
                    <Projectors
                        animationPhase={animationPhase}
                        setAnimationPhase={setAnimationPhase}
                        isMobile={rig.isMobile}
                    />
                )}
                {showScreens && (
                    <group position={[0, 2.03, 0]} rotation={[-3.10, 0.52, -3.07]}>
                        <Screens
                            revealStarted={animationPhase >= 1}
                            onAllRevealed={() => setAnimationPhase((p: number) => Math.max(p, 2))}
                            showLogo={animationPhase >= 8}
                            isMobile={rig.isMobile}
                        />
                    </group>
                )}
            </Suspense>

            {/* ── Dev Editors ── */}
            {/* ScreenEditor inside same group transform as production screens */}
            {/* <group position={[0, 2.03, 0]} rotation={[-3.10, 0.52, -3.07]}>
                <ScreenEditor />
            </group> */}
            {/* ProjectorEditor shares the rig's coordinate space */}
            {/* <ProjectorEditor /> */}
        </group>
    );
}

export default function Scene({ animationPhase, setAnimationPhase }: SceneProps) {
    const [cameraConfig, setCameraConfig] = useState({ position: [0, 1, 15] as [number, number, number], fov: 45, isMobile: false });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspect = width / height;

            // Base values
            let z = 15;
            let y = 1;
            let fov = 45;

            if (aspect < 1) {
                // Portrait (Mobile)
                // Lower camera so model appears higher on screen
                z = 15 + (1 - aspect) * 6;
                y = 1 - (1 - aspect) * 2;
                fov = 45 + (1 - aspect) * 8;
            } else {
                // Landscape (Desktop)
                // Slightly zoom in or stay steady
                z = 15;
                y = 1;
                fov = 45;
            }

            setCameraConfig({ position: [0, y, z], fov, isMobile: aspect < 1 });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="canvas-container">
            <Canvas
                dpr={cameraConfig.isMobile ? 1 : [1, 2]}
                gl={{ powerPreference: "high-performance" }}
                camera={{
                    position: cameraConfig.position,
                    fov: cameraConfig.fov
                }}
            >
                {/* Thick Warehouse Fog to swallow the horizon */}
                <fog attach="fog" args={['#05080a', 5, 25]} />

                {/* Floor Grid — starts materializing when projector 2 lights up */}
                <AnimatedGrid visible={animationPhase >= 6} />

                {/* Atmospheric haze — concert stage ambiance */}
                <StageHaze isMobile={cameraConfig.isMobile} />

                {/* Interactive Camera Controls */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                    minAzimuthAngle={-Math.PI / 4}
                    maxAzimuthAngle={Math.PI / 4}
                    autoRotate={false}
                    autoRotateSpeed={0.5}
                />

                <RigWrapper animationPhase={animationPhase} setAnimationPhase={setAnimationPhase} />

                {/* POST PROCESSING PIPELINE */}
                {cameraConfig.isMobile ? (
                    <EffectComposer>
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    </EffectComposer>
                ) : (
                    <EffectComposer>
                        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    </EffectComposer>
                )}
            </Canvas>
        </div>
    );
}
