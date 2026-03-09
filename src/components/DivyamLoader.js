"use client"
import React, { useEffect, useState, useRef } from "react";
function DivyamLoader() {
    const [loading, setLoading] = useState(true);
    const [percent, setPercent] = useState(0);
    const [degree, setDegree] = useState(0);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    
    useEffect(() => {
        // Animation duration in milliseconds (3 seconds)
        const duration = 800;
        
        const animate = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsedTime = timestamp - startTimeRef.current;
            
            // Calculate progress as a percentage of the duration
            const progress = Math.min(elapsedTime / duration * 100, 100);
            const roundedProgress = Math.floor(progress);
            
            if (roundedProgress !== percent) {
                setPercent(roundedProgress);
                setDegree(roundedProgress * 3.6); // 3.6 degrees per percentage (360° / 100)
            }
            
            if (progress < 100) {
                // Continue animation
                animationRef.current = requestAnimationFrame(animate);

            } else {
                // Animation complete
                setLoading(false);
            }
        };
        
        // Start the animation
        animationRef.current = requestAnimationFrame(animate);
        
        // Cleanup function
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);
    
    return (
        <div 
            className={`bg-black top-0 w-full fixed z-[99999999] ${
                percent === 100 ? "translate-y-[-100%]" : "translate-y-[0%]"
            } transition-all duration-500`}
        >
            <div className="flex justify-center w-full flex-col items-center h-screen">
                <div className="spinner-border relative text-primary" role="status">
                    <div className="w-[300px] relative h-[300px] flex items-center justify-center rounded-full">
                        <div
                            style={{
                                background: `conic-gradient(
                                    transparent ${degree}deg,
                                    #000 ${degree}deg,
                                    #000 360deg
                                )`,
                            }}
                            className="absolute w-[250px] z-[9] h-[250px] rounded-full"
                        ></div>
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="absolute w-[250px] z-[1] h-[250px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DivyamLoader;