"use client"
import React, { useEffect } from 'react';
import "@/app/globals.css"
const LoadingSpinner = () => {

  useEffect(() => {
   window.scrollTo(0, 0);
  }, [])
  
    return (
      <div className="flex divyamRegular items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="text-white text-lg ml-4">Loading, please wait...</p>
      </div>
    );
  };

export default LoadingSpinner;