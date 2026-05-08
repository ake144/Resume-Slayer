"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 2000,
}: {
  text: string;
  words: string[];
  duration?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.span
        layoutId="subtext"
        className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-lg mr-3"
      >
        {text}
      </motion.span>

      <motion.span
        layout
        className="relative w-fit overflow-hidden rounded-md border border-white/10 bg-black px-4 py-2 font-sans text-2xl font-bold tracking-tight text-white shadow-sm shadow-blue-500/10 drop-shadow-lg md:text-5xl"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -40, filter: "blur(10px)" }}
            animate={{
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.5,
            }}
            className={cn("inline-block whitespace-nowrap text-blue-500 bg-clip-text text-3xl md:text-5xl lg:text-6xl text-transparent bg-gradient-to-r from-blue-400 to-blue-600")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
};
