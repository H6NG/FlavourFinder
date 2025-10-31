import React from "react";

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-sm sm:max-w-md border border-black rounded-2xl p-6 sm:p-10 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 tracking-tight">
          Sign In
        </h1>
        <form className="flex flex-col space-y-5 sm:space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="border border-black rounded-lg px-4 py-3 bg-transparent text-sm sm:text-base outline-none focus:outline-none focus:ring-0 focus:border-black"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-black rounded-lg px-4 py-3 bg-transparent text-sm sm:text-base outline-none focus:outline-none focus:ring-0 focus:border-black"
          />
          <button
            type="submit"
            className="border border-black rounded-lg py-3 font-semibold text-sm sm:text-base hover:bg-black hover:text-white transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-xs sm:text-sm mt-6 sm:mt-8">
          Don’t have an account?{" "}
          <a href="/signup" className="underline hover:opacity-70">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
