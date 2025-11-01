import React from "react";

function ClientPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-7xl font-extrabold text-gray-900">We choose. You enjoy.</h1>

      <div className="flex space-x-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition">
        Sign Up
        </button>
        <button className="px-6 py-3 bg-gray-200 text-gray-900 rounded-xl shadow-md hover:bg-gray-300 transition">
        Login
        </button>
      </div>
    </div>
  );
}

export default ClientPage;