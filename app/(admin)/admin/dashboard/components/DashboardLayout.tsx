"use client";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  activeBranch: string;
  onBranchChange: (branch: string) => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({
  activeBranch,
  onBranchChange,
  children,
}) => {
  const { t } = useTranslation();

  const branches = ["main", "THỦ ĐỨC", "GÒ VẤP"];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl w-full bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border">
        <div className="mb-8">
          <nav className="flex space-x-4">
            {branches.map((branch) => (
              <button
                key={branch}
                onClick={() => onBranchChange(branch)}
                className={`px-4 py-2 rounded-lg ${
                  activeBranch === branch
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {branch === "main" ? t("dash.overview") : branch}
              </button>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
