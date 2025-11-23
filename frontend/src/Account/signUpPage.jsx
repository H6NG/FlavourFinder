import React from "react";
import { useEffect, useState, useRef } from "react";


export default function SignUpPage() {

  const email = useRef(null);
  const password = useRef(null); 
  const token = useRef(null); 
  const name = useRef(null); 

  const handleSubmit = async(e) => {

    // no need to call handleSubmit() func; just change onSubmit={handleSubmit}
    e.preventDefault();
    const emailCurrent = email.current.value;
    const passwordCurrent = password.current.value;

    console.log("Submitted:", emailCurrent, passwordCurrent);
    await signFetch(emailCurrent, passwordCurrent, "", "");
  };

  const signFetch = async(globalEmail, globalPassword, name, token) => {

    try {

      const response = await fetch('https://ffpg.bungalou.ca:5433/api/v1/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: globalEmail, 
            name: name, 
            password: globalPassword, 
            token: token, 
          }),

      })

      if(!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);

    }
    catch(error){
        console.error(error.message); 
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-sm sm:max-w-md border border-black rounded-2xl p-6 sm:p-10 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 tracking-tight">
          Sign up
        </h1>
        <form className="flex flex-col space-y-5 sm:space-y-6">
          <input
            type="email"
            ref={email}
            placeholder="Email"
            className="border border-black rounded-lg px-4 py-3 bg-transparent text-sm sm:text-base outline-none focus:outline-none focus:ring-0 focus:border-black"
          />
          <input
            type="password"
            ref={password}
            placeholder="Password"
            className="border border-black rounded-lg px-4 py-3 bg-transparent text-sm sm:text-base outline-none focus:outline-none focus:ring-0 focus:border-black"
          />
          <button
            type="submit"
            onClick={handleSubmit} //for forms, it's onSubmit
            className="border border-black rounded-lg py-3 font-semibold text-sm sm:text-base hover:bg-black hover:text-white transition cursor-pointer"
          >
            Connect
          </button>
        </form>
        <p className="text-center text-xs sm:text-sm mt-6 sm:mt-8">
          Have an account?{" "}
          <a href="/login" className="underline hover:opacity-70">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}