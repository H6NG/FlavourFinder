import React, { useRef, useState } from "react";
import "./loginPage.css";

export default function LoginPage() {

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Error state to highlight inputs
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setError(true);
      return;
    }

    try {
      const res = await fetch(
        "https://c2tp-backend-python.onrender.com/api/userLogin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // No popup — just red borders
        setError(true);
        return;
      }

      // Success: clear error state
      setError(false);

      // Save tokens in cookies (HttpOnly cookies require backend, so using JS cookies here)
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=3600;`;
      document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=86400;`;

      // Redirect
      window.location.href = "/app";

    } catch (err) {
      setError(true);
    }
  };

  const inputStyle = `border rounded-lg px-4 py-3 bg-transparent text-sm sm:text-base 
                      outline-none focus:outline-none focus:ring-0 
                      ${error ? "border-red-500" : "border-black"}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-sm sm:max-w-md border border-black rounded-2xl p-6 sm:p-10 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 tracking-tight">
          Welcome Back | Login
        </h1>

        <form className="flex flex-col space-y-5 sm:space-y-6" onSubmit={handleLogin}>
          
          <input
            type="email"
            ref={emailRef}
            placeholder="Email"
            className={inputStyle}
          />

          <input
            type="password"
            ref={passwordRef}
            placeholder="Password"
            className={inputStyle}
          />

          {error && (
            <p className="text-red-600 text-sm -mt-4">
              Incorrect email or password.
            </p>
          )}

          <button
            type="submit"
            className="border border-black rounded-lg py-3 font-semibold text-sm sm:text-base hover:bg-black hover:text-white transition cursor-pointer"
          >
            Connect
          </button>

        </form>

        <p className="text-center text-xs sm:text-sm mt-6 sm:mt-8">
          Don’t have an account?
          <a href="/signup" className="underline hover:opacity-70 ml-1">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}


