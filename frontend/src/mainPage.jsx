import React from "react";
import { Link } from "react-router-dom";

function ClientPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      
      <header className="w-full flex justify-start p-6">
        <div className="flex space-x-4">
          <Link
            to="/signup"
            className="px-5 py-2 border border-black rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-200"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 border border-black rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-200"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-7xl font-extrabold text-center tracking-tight">
          We choose. You enjoy.
        </h1>
      </main>
    </div>
  );
}

export default ClientPage;
