"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";

interface RevealButtonProps {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export default function RevealButton({
  text,
  icon,
  onClick,
}: RevealButtonProps) {
  const defaultIcon = <ArrowRight className="w-5 h-5" />;
  const isReactElement = React.isValidElement(icon);

  const blackIcon = isReactElement
    ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: "w-5 h-5 text-black",
      })
    : defaultIcon;

  const whiteIcon = isReactElement
    ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: "w-5 h-5 text-white",
      })
    : React.cloneElement(defaultIcon, { className: "w-5 h-5 text-white" });

  return (
    <motion.button
      className="relative overflow-hidden rounded-full py-3 pl-[56px] pr-6 flex items-center gap-6 bg-white text-black font-semibold border-2 border-transparent cursor-pointer"
      whileHover="hover"
      initial="rest"
      animate="rest"
      onClick={onClick}
    >
      {/* Nền đỏ hình tròn + grow khi hover */}
      <motion.span
        variants={{
          rest: { width: 48 },
          hover: { width: "100%" },
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute inset-y-0 left-0 w-[48px] bg-[#ff3d2e] z-0 rounded-full"
      />

      {/* Icon chuyển màu khi hover */}
      <div className="absolute inset-y-0 left-0 w-[48px] z-10 flex items-center justify-center">
        <div className="relative w-5 h-5 overflow-hidden">
          {/* Icon đen */}
          <motion.span
            variants={{
              rest: { x: 0 },
              hover: { x: -24 },
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute left-0 top-0"
          >
            {blackIcon}
          </motion.span>

          {/* Icon trắng */}
          <motion.span
            variants={{
              rest: { x: 24 },
              hover: { x: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute left-0 top-0"
          >
            {whiteIcon}
          </motion.span>
        </div>
      </div>

      {/* Text chuyển màu lên xuống */}
      {/* Text chuyển màu lên xuống */}
      <div className="relative z-10 overflow-hidden h-[24px] flex items-center">
        <motion.span
          variants={{
            rest: { y: 0 },
            hover: { y: "-100%" },
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="block"
        >
          <span className="block text-black">{text}</span>
          <span className="block text-white absolute top-full left-0">
            {text}
          </span>
        </motion.span>
      </div>
    </motion.button>
  );
}
