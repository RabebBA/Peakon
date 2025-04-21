import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [active, setActive] = useState(false);

  const isActive = () => {
    setActive(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 w-full h-14 px-4 flex items-center transition-colors duration-300 z-50 ${
        active ? "bg-white text-black shadow-md" : "bg-white/10 text-white"
      }`}
    >
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo dark={active} />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button
            size="sm"
            variant={active ? "outline" : "ghost"}
            asChild
            className={`${
              active
                ? "bg-white text-black shadow-md"
                : "bg-white/10 text-white"
            }`}
          >
            <a href="/contact">Contact us</a>
          </Button>
          <Button
            size="sm"
            asChild
            className={active ? "text-white bg-black hover:bg-zinc-800" : ""}
          >
            <a href="/login">Login</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
