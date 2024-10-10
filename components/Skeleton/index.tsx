import React from "react";

const SkeletonNovel = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-black rounded-lg shadow-solid-3 p-4 flex flex-col items-center justify-center">
      <div className="bg-gray-300 dark:bg-gray-700 h-48 w-full rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
  );
};

export default SkeletonNovel;
