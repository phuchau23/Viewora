"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatPopup from "./components/ChatPopup";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const controls = useAnimation();

  // Lắc mỗi vài giây (tuỳ chỉnh)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!open) {
        controls.start({
          rotate: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.6 },
        });
      }
    }, 1000); // mỗi 5s lắc 1 lần

    return () => clearInterval(interval);
  }, [open, controls]);

  return (
    <>
      <div className="fixed bottom-20 right-6 z-50">
        <motion.button
          animate={controls}
          whileHover={{ scale: 1.1 }}
          onClick={() => setOpen(true)}
          className="p-4 bg-primary text-white rounded-full shadow-lg"
        >
          <MessageCircle />
        </motion.button>
      </div>
      {open && <ChatPopup onClose={() => setOpen(false)} />}
    </>
  );
}
