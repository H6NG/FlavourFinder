/*import React from "react";
import { Link } from "react-router-dom";

function ClientPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-[Inter]">
      
      <header className="w-full flex justify-end p-6">
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
          We choose. You enjoy.
        </h1>
      </main>
    </div>
  );
}

export default ClientPage;
*/

import React from "react";
import { Link } from "react-router-dom";

function ClientPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-[Inter] relative">
      
      <header className="hidden sm:flex w-full justify-end p-6">
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
          We choose. You enjoy.
        </h1>
      </main>

      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 flex justify-center">
        <Link
          to="/login"
          className="w-[90%] max-w-sm bg-black text-white text-center py-3 rounded-lg font-medium hover:opacity-80 transition"
        >
          Connect
        </Link>
      </div>
    </div>
  );
}

export default ClientPage;
