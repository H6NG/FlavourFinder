import React from "react";
import { Link } from "react-router-dom";
import logo from "/images/logo.png";

export default function ClientPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-[Inter] relative">
      
      <header className="hidden sm:flex w-full items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold tracking-tight hover:text-gray-700 transition-all"
          >
            FlavourFinder
          </Link>
          <img src={logo} alt="FlavourFinder Logo" className="w-8 h-8 object-contain"/>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/signup"
            className="px-4 py-2 border border-black rounded-md font-medium text-sm sm:text-base hover:bg-black hover:text-white transition-all duration-200"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 border border-black rounded-md font-medium text-sm sm:text-base hover:bg-black hover:text-white transition-all duration-200"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight max-w-3xl">
          We choose<span className="text-green-800">.</span> You enjoy<span className="text-green-800">.</span>
        </h1>
      </main>

      <div className="sm:hidden flex items-center justify-center pt-12">
        <h1 className="text-3xl font-mono font-semibold tracking-tight">
          Flavour <span className="text-green-500">Finder</span>
        </h1>
      </div>
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 flex justify-center">
        <Link
          to="/login"
          className="w-[90%] max-w-sm bg-black text-white text-center py-3 rounded-lg font-medium font-mono transition"
        >
          Connect / Sign up
        </Link>
      </div>
    </div>
  );
}
