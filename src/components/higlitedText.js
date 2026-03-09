import React from "react"
import { useEffect, useRef, useState } from 'react';

export default function BouncingHighlightedMarquee() {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [position, setPosition] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);
    const [direction, setDirection] = useState(1); // 1 for right, -1 for left
    const [isMobile, setIsMobile] = useState(false);

    const marqueeTxt = "Complete the Profile To Order Our Packages";

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;

        // Get container dimensions
        const updateDimensions = () => {
            if (container && content) {
                setContainerWidth(container.offsetWidth);
                setContentWidth(content.offsetWidth);
                setIsMobile(window.innerWidth < 640);
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        // Animation loop
        let animationId;
        let lastTimestamp = 0;

        const animate = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const elapsed = timestamp - lastTimestamp;

            if (elapsed > 16) { // Cap at ~60fps
                lastTimestamp = timestamp;

                // Only animate if not mobile (on mobile we'll wrap text)
                if (!isMobile) {
                    setPosition(prevPos => {
                        const newPos = prevPos + (direction * 1.5); // Adjust speed here

                        // Change direction when reaching edges
                        if (newPos <= 0) {
                            setDirection(1); // Start moving right
                            return 0;
                        } else if (newPos >= containerWidth - contentWidth) {
                            setDirection(-1); // Start moving left
                            return containerWidth - contentWidth;
                        }

                        return newPos;
                    });
                }
            }

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            cancelAnimationFrame(animationId);
        };
    }, [direction, isMobile, containerWidth, contentWidth]);

    return (
        <div
            ref={containerRef}
            className="w-full  overflow-hidden py-2 px-4 rounded-md"
        >
            <div
                ref={contentRef}
                className={`inline-block ${isMobile ? 'w-full text-center' : 'whitespace-nowrap'}`}
                style={{
                    transform: isMobile ? 'none' : `translateX(${position}px)`,
                }}
            >
                <span className="bg-yellow-300 px-3 py-1 font-medium text-black rounded">
                    {marqueeTxt}
                </span>
            </div>
        </div>
    );
}