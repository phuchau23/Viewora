"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface BranchFilterProps {
  branches: string[];
  selectedBranch: string | null;
  onChange: (branch: string | null) => void;
}

const BranchFilter: React.FC<BranchFilterProps> = ({
  branches,
  selectedBranch,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
      <label htmlFor="branch-select">{t("filterLabel")}</label>
      <select
        id="branch-select"
        className="border border-gray-300 rounded px-3 py-1 text-sm"
        value={selectedBranch || ""}
        onChange={(e) => {
          const value = e.target.value;
          onChange(value === "" ? null : value);
        }}
      >
        <option value="">{t("allBranches")}</option>
        {branches.map((branch) => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BranchFilter;
