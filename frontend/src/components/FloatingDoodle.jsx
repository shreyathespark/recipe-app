import React from "react";
import { motion } from "framer-motion";
import { FaAppleAlt, FaPizzaSlice, FaHamburger } from "react-icons/fa";

const doodles = [FaAppleAlt, FaPizzaSlice, FaHamburger];

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

export default function FloatingDoodle() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => {
        const Icon = doodles[Math.floor(Math.random() * doodles.length)];
        const size = getRandom(20, 50);
        const duration = getRandom(10, 20);

        return (
          <motion.div
            key={i}
            className="absolute text-red-400"
            style={{
              top: getRandom(0, 80) + "%",
              left: getRandom(0, 90) + "%",
              fontSize: size,
              opacity: 0.7,
            }}
            animate={{ y: [0, 100, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: duration,
              ease: "linear",
            }}
          >
            <Icon />
          </motion.div>
        );
      })}
    </>
  );
}
