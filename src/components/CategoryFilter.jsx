// /app/themes/components/CategoryFilter.jsx
"use client";
import React from "react";

const categories = [
  { id: "all", name: "All Themes", color: "gray" },
  { id: "Personal", name: "Personal", color: "pink" },
  { id: "Business", name: "Business", color: "blue" },
  { id: "Creative", name: "Creative", color: "purple" },
  { id: "Education", name: "Education", color: "green" },
  { id: "Professional", name: "Professional", color: "orange" },
];

const colorClasses = {
  gray: {
    active: "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
    inactive: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
  },
  pink: {
    active: "bg-pink-600 text-white",
    inactive: "bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400 dark:hover:bg-pink-900/30"
  },
  blue: {
    active: "bg-blue-600 text-white",
    inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
  },
  purple: {
    active: "bg-purple-600 text-white",
    inactive: "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
  },
  green: {
    active: "bg-green-600 text-white",
    inactive: "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
  },
  orange: {
    active: "bg-orange-600 text-white",
    inactive: "bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
  }
};

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all
            ${activeCategory === category.id 
              ? colorClasses[category.color].active + " shadow-lg scale-105" 
              : colorClasses[category.color].inactive
            }
            hover:scale-105 active:scale-95
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;