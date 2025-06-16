import React, { useState } from "react";
import { Search, Settings2, Sparkles } from "lucide-react";

interface MovieSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function MovieSearch({
  searchTerm,
  onSearchChange,
}: MovieSearchProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div className="flex w-3/4 mx-auto">
        <div className="relative group w-11/12">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400 dark:text-gray-400 group-focus-within:text-amber-500 transition-colors duration-200" />
          </div>
          <input
            type="text"
            placeholder="Search for movies, directors, actors..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-16 pr-16 py-5 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-3xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 shadow-xl hover:shadow-2xl text-lg font-medium"
          />
          <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
            <Sparkles className="h-6 w-6 text-gray-300 dark:text-gray-300 group-focus-within:text-amber-400 transition-colors duration-200" />
          </div>

          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl dark:bg-background bg-gradient-to-r from-white to-orange-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        <Settings2
          onClick={() => setIsOpen(!isOpen)}
          className="w-1/12 my-auto h-6 text-gray-400 dark:text-gray-400 group-focus-within:text-amber-500 transition-colors duration-200"
        />
      </div>
      {/* Search suggestions hint */}
      {searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 text-center">
          <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-md">
            Press Enter to search
          </span>
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 text-center">
          <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-md">
            Filter
          </span>
        </div>
      )}
    </div>
  );
}
