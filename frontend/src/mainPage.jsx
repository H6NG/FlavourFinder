import React from "react";
import { Link } from "react-router-dom";

export default function ClientPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-[Inter] relative">
      
      <header className="hidden sm:flex w-full items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="text-lg sm:text-3xl font-bold font-sans tracking-tight transition-all"
          >
            FlavourFinder
          </Link>
          <img src="./images/logo.png" alt="FlavourFinder Logo" className="w-20 h-20 object-contain"/>
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

      <header className="flex sm:hidden w-full justify-center items-center p-4 space-x-2">
        <Link
          to="/"
          className="text-2xl font-bold font-sans tracking-tight transition-all"
        >
          FlavourFinder
        </Link>
        <img
          src="./images/logo.png"
          alt="FlavourFinder logo"
          className="w-9 h-9 object-contain"
        />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <div className="hidden sm:block w-full h-52"></div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight max-w-3xl">
          We choose<span className="text-green-800">.</span> You enjoy<span className="text-green-800">.</span>
        </h1>
        <div className="hidden sm:block w-full h-90"></div>
      </main>
      
      <footer className="hidden sm:flex w-full justify-center items-center py-6 h-50 bg-green-800 text-white rounded-t-3xl">
        <p className="text-center text-sm font-mono">
          © {new Date().getFullYear()} FlavourFinder. All rights reserved.<br/>
          Engineered by Faysal Ariss, Jerry Chen, Hang Liu, Aaron Zhao and Kevin Zhu
        </p>
      </footer>

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
