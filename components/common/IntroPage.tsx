"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const topBlocks = Array.from({ length: 5 }, (_, i) => ({
  top: true,
  left: `${i * 20}%`,
  width: "20%",
  delay: i * 0.1,
}));

const bottomBlocks = Array.from({ length: 5 }, (_, i) => ({
  top: false,
  left: `${i * 20}%`,
  width: "20%",
  delay: i * 0.1,
}));

const columns = [...topBlocks, ...bottomBlocks];

export default function PageIntroReveal() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {columns.map((col, i) => (
            <motion.div
              key={i}
              className="absolute bg-primary"
              style={{
                left: col.left,
                width: col.width,
                height: "50%",
                top: col.top ? "0" : "auto",
                bottom: col.top ? "auto" : "0",
              }}
              initial={{ y: 0 }}
              animate={{ y: col.top ? "-150%" : "150%" }}
              exit={{ opacity: 0 }}
              transition={{
                delay: col.delay,
                duration: 2.5,
                ease: [0.75, 0, 0.25, 1],
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
