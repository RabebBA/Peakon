import React from "react";

export const Logo = ({ dark = true }) => {
  return (
    <a
      href="/"
      className="hover:opacity-80 transition-all items-center gap-x-2 hidden md:flex"
    >
      <img src="/logo0.png" alt="Logo" height={40} width={40} />
      <p
        className={`text-2xl font-bold pb-1 transform transition-all duration-300 ease-in-out hover:scale-105 ${
          dark ? "text-neutral-700" : "text-gray-300"
        }`}
      >
        Peakon
      </p>
    </a>
  );
};
