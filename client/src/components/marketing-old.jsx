import React from "react";
import { Medal } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Marketing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center flex-col ">
      <div className="flex items-center justify-center flex-col custom-font">
        <div className="mb-4 flex items-center border shadow-sm p-4 bg-[#cacbf0] text-[#5356ef] rounded-full uppercase">
          <Medal className="h-6 w-6 mr-2" />
          No 1 task management
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
          Work together, flow better{" "}
        </h1>
        <div className="text-3xl md:text-6xl bg-gradient-to-br from-[#983be3] via-[#1b87f8] to-[#d51cda] text-white px-4 p-2 rounded-md pb4 w-fit">
          Work forward
        </div>
      </div>
      <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto poppins-font">
        Collaborate seamlessly, manage projects efficiently, and unlock new
        levels of productivity. Whether in high-rise offices or remote
        workspaces, empower your team to achieve more with Harmony.
      </div>
      <Button className="mt-6" size="lg" onClick={() => navigate("/login")}>
        Login
      </Button>
    </div>
  );
};

export default Marketing;
