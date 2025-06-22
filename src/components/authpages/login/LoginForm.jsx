"use client";
import React, { useState } from "react";
import LanguageSelector from "./LanguageSelector";
import InputField from "./InputField";
import Button from "./Button";
import Divider from "./Divider";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login with:", email, password);
  };

  return (
    <main className="flex justify-center items-center p-5 w-full bg-neutral-900 min-h-screen">
      <section className="flex flex-col w-full max-w-[390px]">
        <header className="flex justify-between items-center mb-10">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ecfe5de30fb6227d26ec75e4fd3e471879ab5d5"
            alt="Logo"
            className="w-[43px] h-[40px]"
          />
          <LanguageSelector />
        </header>

        <div className="flex flex-col gap-5 mb-11">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-medium tracking-normal text-zinc-100">
              Welcome
            </h1>
            <p className="text-xs tracking-normal leading-4 text-zinc-100">
              We're so excited to have again
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-5">
              <InputField
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword(!showPassword)}
              />
            </div>

            <button
              type="button"
              className="text-xs tracking-normal leading-4 text-right text-indigo-700 self-end"
            >
              Forget Password?
            </button>

            <Button type="submit" variant="primary" className="mb-7">
              Login
            </Button>
          </form>
        </div>

        <Divider text="or" className="mb-7" />

        <Button variant="secondary">Sign Up</Button>
      </section>
    </main>
  );
}

export default LoginForm;
