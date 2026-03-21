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
  const [animationPhase, setAnimationPhase] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio object once
  useEffect(() => {
    audioRef.current = new Audio("/introSong/intro.mp3");
    audioRef.current.volume = 0.5; // Set a reasonable default volume
  }, []);

  // Trigger audio when first screens load (Phase 1)
  useEffect(() => {
    if (animationPhase === 1 && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.warn("Browser blocked autoplay. Audio will start on first click.");
          const playOnInteract = () => {
            audioRef.current?.play();
            document.removeEventListener("click", playOnInteract);
          };
          document.addEventListener("click", playOnInteract);
        });
      }
    }
  }, [animationPhase]);

  // Phase 7 → 8: after floor materializes, wait then show text
  useEffect(() => {
    if (animationPhase === 7) {
      const timer = setTimeout(() => {
        setAnimationPhase(p => Math.max(p, 8));
      }, 1500); // 1.5s for floor to materialize before text appears
      return () => clearTimeout(timer);
    }
  }, [animationPhase]);

  return (
    <main className="container">
      {/* Leva Panel — constrained via global CSS in globals.css */}
      {/* <Leva
        collapsed
        oneLineLabels
        flat
        theme={{
          sizes: { rootWidth: '220px', folderTitleHeight: '24px', rowHeight: '20px' },
          space: { rowGap: '2px', md: '4px', sm: '2px' },
          fontSizes: { root: '10px' }
        }}
      /> */}

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
