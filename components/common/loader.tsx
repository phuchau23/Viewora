"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Loader = ({ onFinish }: { onFinish: () => void }) => {
  const sloganRef = useRef<HTMLDivElement>(null);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const slogan = "Đặt vé dễ dàng – Trải nghiệm điện ảnh tuyệt vời";
    let index = 0;

    const typeSlogan = () => {
      if (sloganRef.current) {
        sloganRef.current.textContent = slogan.slice(0, index);
        index++;
        if (index <= slogan.length) {
          setTimeout(typeSlogan, 50);
        } else {
          gsap.to(".loader", {
            opacity: 0,
            duration: 1,
            delay: 0.5,
            onComplete: () => {
              setShowLoader(false);
              onFinish(); // thông báo đã xong để hiện Home
            },
          });
        }
      }
    };
    
    typeSlogan();
  }, [onFinish]);

  if (!showLoader) return null;

  return (
    <div className="loader fixed inset-0 bg-black text-white flex items-center justify-center z-50">
      <div className="text-xl md:text-3xl font-mono" ref={sloganRef}></div>
    </div>
  );
};

export default Loader;
