"use client";

import { useEffect, useRef } from "react";
import RINGS from "vanta/dist/vanta.rings.min";
import * as THREE from "three";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";
import Cylinder from "@/mini components/Cylinder";

export default function VantaBackground() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    // Run only on client
    if (typeof window !== "undefined" && !vantaEffect.current) {
      vantaEffect.current = RINGS({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x000000, // Proper hex (black)
        color: 0x0a3dff, // Blue ring color
      });
    }

    return () => {
      // Cleanup on unmount
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="flex items-center justify-start flex-col relative w-screen h-screen overflow-hidden"
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Title */}
      <h1 className="text-center text-5xl md:text-8xl font-semibold mt-10 text-white select-none">
        AI WORLD
      </h1>

      {/* 3D Cylinder Animation */}
      <div className="flex items-center justify-center mt-4 md:mt-0 mb-5 h-[40vh] md:h-[70vh] w-full">
        <Cylinder />
      </div>

      {/* Explore Button (visible on mobile) */}
      <Link href="/tools" className="flex md:hidden text-white w-auto ">
        <div className="group flex items-center justify-center py-3 gap-4 rounded-full bg-[#000000ba] w-52 mt-20 font-bold border border-cyan-500 hover:bg-black transition-all">
          <h2 className="text-xl sm:text-3xl text-center transition-colors">
            Explore More
          </h2>
          <ArrowBigRight className="group-hover:text-blue-600 transition-colors" />
        </div>
      </Link>
    </div>
  );
}
