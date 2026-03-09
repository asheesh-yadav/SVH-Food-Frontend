'use client';
import dynamic from "next/dynamic";


const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/[0.96]">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="w-16 h-16 border-4 border-t-transparent border-[#ff7614] rounded-full animate-spin"></div>

        {/* Inner pulse ring */}
        <div className="absolute w-10 h-10 border-4 border-b-transparent border-[#d40101b6] rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>

        {/* Glow center */}
        <div className="absolute w-3 h-3 bg-gradient-to-r from-[#ff7614] to-[#d40101b6] rounded-full blur-[2px]"></div>
      </div>
    </div>
  ),
});

export function SplineScene({
  scene,
  className
}) {
  return (
    <Spline scene={scene} className={className} />
  );
}