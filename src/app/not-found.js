"use client"
import React from 'react';
import { Home, Search, ArrowLeft, Contact } from 'lucide-react';
import Link from 'next/link';
import "@/app/globals.css";

function PageNotFound() {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 shadow-xl rounded-xl p-8 text-center">
                {/* Error code and illustration */}
                <div className="mb-6">
                    <h1 className="text-6xl font-bold text-blue-400">404</h1>
                    <div className="my-4 flex justify-center">
                        <svg className="w-32 h-32 text-blue-500" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 30C61.34 30 30 61.34 30 100C30 138.66 61.34 170 100 170C138.66 170 170 138.66 170 100C170 61.34 138.66 30 100 30ZM100 45C130.38 45 155 69.62 155 100C155 130.38 130.38 155 100 155C69.62 155 45 130.38 45 100C45 69.62 69.62 45 100 45Z" fill="currentColor" />
                            <path d="M70 85C75.52 85 80 80.52 80 75C80 69.48 75.52 65 70 65C64.48 65 60 69.48 60 75C60 80.52 64.48 85 70 85Z" fill="currentColor" />
                            <path d="M130 85C135.52 85 140 80.52 140 75C140 69.48 135.52 65 130 65C124.48 65 120 69.48 120 75C120 80.52 124.48 85 130 85Z" fill="currentColor" />
                            <path d="M65 125C65 125 75 105 100 105C125 105 135 125 135 125" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>

                {/* Message */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
                    <p className="text-gray-300 mb-4">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex cursor-pointer items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                        <ArrowLeft className="mr-2 w-5 h-5" />
                        Go Back
 

 
 
                    </button>

                    <div className="flex gap-3">
                        <Link href={"/"}
                    
                            className="flex-1 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg transition-colors duration-300"
                        >
                            <Home className="mr-2 w-5 h-5" />
                            Home
                        </Link>

                      
                            <Link href={"/contact"}
                                className="flex-1 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg transition-colors duration-300"
                            >
                                <Contact className="mr-2 w-5 h-5" />
                                Contact
                            </Link>
                       
                    </div>
                </div>
            </div>

            {/* Optional footer text */}
            <p className="mt-8 text-gray-400 text-sm">
                If you believe this is an error, please contact support.
            </p>
        </div>
    );
}

export default PageNotFound;