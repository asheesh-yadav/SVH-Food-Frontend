
import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen  text-center">
      <div className="px-4 py-12">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-400 my-6">
          Oops! Content Not Found
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mb-8">
          The page you're looking for doesn't exist or has been not developed at.
        </p>
        <Link
          to={"/"}
          className="px-6 py-3 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 ease-in-out"
        >
          Go Back Home
        </Link>
      </div>
    </div>
    </div>
  )
}

export default NotFound
