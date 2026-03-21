"use client";

import React, { useEffect } from "react";
import { useControls, button } from "leva";
import * as THREE from "three";
import { useTexture, useVideoTexture } from "@react-three/drei";
import { DESKTOP_SCREEN_CONFIGS, MOBILE_SCREEN_CONFIGS } from "./Screens";

/**
 * ── Screen Editor (Development Only) ──
 * This component provides Leva UI controls for positioning screens.
 * It can be safely commented out in Scene.tsx without breaking the animation chain.
 * The animation and rendering are handled by Screens.tsx.
 */

function EditableScreen({ config }: { config: any }) {
    const isVideo = config.textureUrl && (config.textureUrl.endsWith(".mp4") || config.textureUrl.endsWith(".webm"));

    const staticTexture = config.textureUrl && !isVideo ? (useTexture(config.textureUrl as string) as THREE.Texture) : null;
    const videoTexture = config.textureUrl && isVideo ? (useVideoTexture(config.textureUrl as string) as THREE.Texture) : null;

    const texture = isVideo ? videoTexture : staticTexture;

    return (
        <mesh position={[config.x, config.y, config.z] as any} rotation={[config.rX, config.rY, config.rZ] as any}>
            <planeGeometry args={[config.width, config.height] as any} />
            {texture ? (
                <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={0.6} side={THREE.DoubleSide} />
            ) : (
                <meshBasicMaterial color="#ff00ff" transparent opacity={0.6} side={THREE.DoubleSide} />
            )}
        </mesh>
    );
}

export default function ScreenEditor() {
    const { profile, activeScreen } = useControls("Screen Mapping", {
        profile: {
            value: "Desktop",
            options: ["Desktop", "Mobile"],
            label: "📱 Profile"
        },
        activeScreen: {
            value: 0,
            options: {
                "Screen 1 (Front)": 0,
                "Screen 2 (Back)": 1,
                "Screen 3 (Left)": 2,
                "Screen 4 (Right)": 3,
            },
            label: "Select Screen"
        }
    });

    const configs = profile === "Mobile" ? MOBILE_SCREEN_CONFIGS : DESKTOP_SCREEN_CONFIGS;
    const defaultConfig = configs[activeScreen] || configs[0];

    const [{ width, height, posX, posY, posZ, rotX, rotY, rotZ }, setLeva] = useControls("Screen Plane Builder", () => ({
        width: { value: defaultConfig.width, min: 0.1, max: 10, step: 0.01 },
        height: { value: defaultConfig.height, min: 0.1, max: 10, step: 0.01 },
        posX: { value: defaultConfig.x, min: -10, max: 10, step: 0.01 },
        posY: { value: defaultConfig.y, min: -10, max: 10, step: 0.01 },
        posZ: { value: defaultConfig.z, min: -10, max: 10, step: 0.01 },
        rotX: { value: defaultConfig.rX, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotY: { value: defaultConfig.rY, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotZ: { value: defaultConfig.rZ, min: -Math.PI, max: Math.PI, step: 0.01 },
        "Copy Screen Data": button((get) => {
            const data = {
                profile,
                screenIndex: activeScreen,
                width: get("Screen Plane Builder.width"),
                height: get("Screen Plane Builder.height"),
                x: get("Screen Plane Builder.posX"),
                y: get("Screen Plane Builder.posY"),
                z: get("Screen Plane Builder.posZ"),
                rX: get("Screen Plane Builder.rotX"),
                rY: get("Screen Plane Builder.rotY"),
                rZ: get("Screen Plane Builder.rotZ"),
            };
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            alert(`Copied ${profile} Screen Data to clipboard!`);
        })
    }), [activeScreen, profile]);

    useEffect(() => {
        setLeva({
            width: defaultConfig.width,
            height: defaultConfig.height,
            posX: defaultConfig.x,
            posY: defaultConfig.y,
            posZ: defaultConfig.z,
            rotX: defaultConfig.rX,
            rotY: defaultConfig.rY,
            rotZ: defaultConfig.rZ,
        });
    }, [activeScreen, defaultConfig, setLeva]);

    const liveConfig = {
        width, height, x: posX, y: posY, z: posZ, rX: rotX, rY: rotY, rZ: rotZ,
        textureUrl: defaultConfig.textureUrl
    };

    return (
        <group>
            {/* Semi-transparent overlay of the screen being edited */}
            <EditableScreen config={liveConfig} />
        </group>
    );
}
