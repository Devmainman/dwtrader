"use client";
import { Link } from "react-router-dom";
import React from "react";

function ActionButtons() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[330px]">
      <button className="w-full text-xs bg-blue-600 rounded-3xl h-[42px] text-zinc-100">
        Sign Up
      </button>
      <Link to="/auth">
       <button className="w-full text-xs text-blue-600 rounded-3xl h-[42px]">
        Already have an account
      </button>
      </Link>
     
    </div>
  );
}

export default ActionButtons;
