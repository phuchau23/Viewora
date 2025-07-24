// components/BranchFilter.tsx
import React from "react";

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
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
      <label htmlFor="branch-select">Filter by Branch</label>
      <select
        id="branch-select"
        className="border border-gray-300 rounded px-3 py-1 text-sm"
        value={selectedBranch || ""}
        onChange={(e) => {
          const value = e.target.value;
          onChange(value === "" ? null : value);
        }}
      >
        <option value="">All Branches</option>
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
