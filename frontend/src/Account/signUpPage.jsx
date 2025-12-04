import React, { useRef } from "react";

export default function SignUpPage() {

  const email = useRef(null);
  const password = useRef(null); 
  const userName = useRef(null);
  const firstName = useRef(null);
  const lastName = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: email.current.value,
      userName: userName.current.value,
      password: password.current.value,
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      glutenFree: false,
      vegetarian: false,
      vegan: false,
      favoriteCuisine: []
    };

    try {
      const response = await fetch(
        "https://c2tp-backend-python.onrender.com/api/registerUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert("Error: " + data.error);
        return;
      }

      alert("Account created!");
      window.location.href = "/login";    // 🔥 redirect
    } 
    catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-sm sm:max-w-md border border-black rounded-2xl p-6 sm:p-10 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 tracking-tight">
          Sign up
        </h1>

        <form className="flex flex-col space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          
          <input ref={email} type="email" placeholder="Email" className="border border-black rounded-lg px-4 py-3" />
          <input ref={userName} type="text" placeholder="Username" className="border border-black rounded-lg px-4 py-3" />
          <input ref={firstName} type="text" placeholder="First Name" className="border border-black rounded-lg px-4 py-3" />
          <input ref={lastName} type="text" placeholder="Last Name" className="border border-black rounded-lg px-4 py-3" />
          <input ref={password} type="password" placeholder="Password" className="border border-black rounded-lg px-4 py-3" />

          <button type="submit" className="border border-black rounded-lg py-3 font-semibold hover:bg-black hover:text-white">
            Sign Up
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
