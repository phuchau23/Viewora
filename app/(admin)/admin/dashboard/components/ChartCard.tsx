"use client";
import React from "react";
import { motion } from "framer-motion";

interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  children: React.ReactNode;
  action?: React.ReactNode; // thêm prop để nhận filter
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  icon,
  isLoading,
  children,
  action,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      </div>
      {action && <div>{action}</div>}
    </div>
    {isLoading ? (
      <div className="animate-pulse">
        <div className="bg-neutral-200 h-64 rounded" />
      </div>
    ) : (
      children
    )}
  </motion.div>
);

export default ChartCard;
