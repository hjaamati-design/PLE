"use client";

import { useState, useEffect, useRef } from "react";
import Scene from "@/components/Scene";
import Header from "@/components/Header";
import HeroContent from "@/components/HeroContent";
import SubscribeForm from "@/components/SubscribeForm";
import Footer from "@/components/Footer";
import FloatingCards from "@/components/FloatingCards";
import FloatingCardsLeft from "@/components/FloatingCardsLeft";
import MobileServicesStrip from "@/components/MobileServicesStrip";
import Loader from "@/components/Loader";
import { useAssetReadiness } from "@/hooks/useAssetReadiness";
import { Leva } from "leva";

/**
 * Animation Phase Timeline:
 *  0 = Initial (model dropping in)
 *  1 = Model landed → screens revealing
 *  2 = Screens done → projectors 5 & 10 lighting up (dramatic stagger)
 *  3 = Projectors 5 & 10 done → right cards appear → reading delay
 *  4 = Reading delay done → projectors 11 & 1 lighting up
 *  5 = Projectors 11 & 1 done → left cards appear → reading delay
 *  6 = Reading delay done → projectors 2 & 4 lighting up
 *  7 = Projectors 2 & 4 done → floor materializes
 *  8 = Floor done → hero text + subscribe form + footer appear
 */
export default function Home() {
  const [animationPhase, setAnimationPhase] = useState(-1);
  const [loaderDone, setLoaderDone] = useState(false);
  const { progress, allReady } = useAssetReadiness();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Called from the Loader's "Enter" button — runs inside a user gesture.
  // iOS Safari requires the Audio to be CREATED + played in the same gesture.
  const handleEnterExperience = () => {
    // Create fresh audio element inside the click handler (iOS requirement)
    const audio = new Audio("/introSong/intro.mp3");
    audio.volume = 0.5;
    audio.setAttribute("playsinline", "");
    audio.play().catch(() => {});
    audioRef.current = audio;

    setAnimationPhase(0);
  };

  // Phase 7 → 8: after floor materializes, wait then show text
  useEffect(() => {
    if (animationPhase === 7) {
      const timer = setTimeout(() => {
        setAnimationPhase(p => Math.max(p, 8));
      }, 1000); // 1s for floor to materialize before text appears
      return () => clearTimeout(timer);
    }
  }, [animationPhase]);

  return (
    <main className="container">
      {/* Loading Screen */}
      {!loaderDone && (
        <Loader
          progress={progress}
          allReady={allReady}
          onEnter={handleEnterExperience}
          onFadeComplete={() => setLoaderDone(true)}
        />
      )}

      {/* 3D Background */}
      <Scene animationPhase={animationPhase} setAnimationPhase={setAnimationPhase} />

      {/* UI Overlay */}
      <div className="content-overlay">
        <FloatingCardsLeft visible={animationPhase >= 5} />
        <FloatingCards visible={animationPhase >= 3} />

        <Header />

        <div className="main">
          <HeroContent visible={animationPhase >= 8} />
          <MobileServicesStrip visible={animationPhase >= 8} />
          <SubscribeForm visible={animationPhase >= 8} />
          <Footer visible={animationPhase >= 8} />
        </div>
      </div>
    </main>
  );
}
