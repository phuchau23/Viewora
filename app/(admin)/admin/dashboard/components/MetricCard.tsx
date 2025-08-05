"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

// AnimatedCounter
const AnimatedCounter: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
}> = ({ value, prefix = "", suffix = "" }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start: number;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / 1000, 1);
      setCount(Math.floor(value * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// MetricCard component
const MetricCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  prefix?: string;
  suffix?: string;
  isLoading?: boolean;
}> = ({ title, value, icon, color, prefix, suffix, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    </div>
    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
      {title}
    </h3>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">
      {isLoading ? (
        <div className="animate-pulse bg-neutral-200 h-8 w-20 rounded" />
      ) : (
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      )}
    </div>
  </motion.div>
);

export default MetricCard;
