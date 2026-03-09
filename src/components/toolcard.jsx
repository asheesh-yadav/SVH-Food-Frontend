"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/app/globals.css";

gsap.registerPlugin(ScrollTrigger);

export default function ToolCard({ toolPath, name, image, id, website }) {
  const [liked, setLiked] = useState(false);
  const cardRef = useRef(null);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likedTools") || "[]");
    setLiked(savedLikes.includes(id));
  }, [id]);

  // ✅ Toggle Like & Save in localStorage
  const handleLike = () => {
    let savedLikes = JSON.parse(localStorage.getItem("likedTools") || "[]");

    if (savedLikes.includes(id)) {
      savedLikes = savedLikes.filter((i) => i !== id);
      setLiked(false);
    } else {
      savedLikes.push(id);
      setLiked(true);
    }

    localStorage.setItem("likedTools", JSON.stringify(savedLikes));
  };

  // ✅ GSAP Scroll Animation
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const anim = gsap.fromTo(
      el,
      { scale: 0.8, opacity: 0.7 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // ✅ Visit Website


  return (
    <div
      ref={cardRef}
      className="transition-transform hover:scale-[1.03]"
    >
      <div className="rounded-sm p-2 w-[240px] h-[273px] flex items-center justify-center">
        <div className="bg-gray-900 rounded-sm p-2 overflow-hidden h-[268px] gap-3 flex flex-col items-start justify-center">

          {/* ✅ Image */}
          <div className="flex rounded-md items-center justify-center h-[200px] w-[200px] overflow-hidden">
            <Link href={website} className="hover:scale-[1.06] transition-all">
              <img
                src={
                  image ||
                  "https://tse1.mm.bing.net/th?id=OIP.YHMN2mdPPmf1Um7__LSK_AHaHa&pid=Api&P=0&h=180"
                }
                alt={name || "tool image"}
                className="w-[140px] h-full rounded-md object-cover"
              />
            </Link>
          </div>

          {/* ✅ Name + Like */}
          <div className="w-full flex justify-between items-start">
            <Link href={website} className="hover:text-blue-500">
              <h2 className="font-semibold text-xs line-clamp-2">{name}</h2>
            </Link>

            <div
              onClick={handleLike}
              className="hover:bg-gray-700 rounded-full flex items-center justify-center p-2 cursor-pointer transition-all"
            >
              <Heart fill={liked ? "red" : "none"} color={liked ? "red" : "white"} />
            </div>
          </div>

          {/* ✅ Visit Button */}
          <Link href={website}>
            <Button
              variant="outline"
              className="text-white font-bold bg-black transition-all duration-150 cursor-pointer hover:scale-[1.05]"
            >
              Visit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
