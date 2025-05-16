import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Box, CircleCheckBig } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import ProjectSlider from "@/components/landing/slider"; // Ajuste le chemin selon l'organisation de tes fichiers

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white px-6 py-32"
        style={{ backgroundImage: "url('/hero.png')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 z-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Streamline Your <br /> Projects with
              <span className="text-blue-400">Peakon</span>
            </h1>
            <p className="mb-6 text-lg text-gray-200 max-w-xl">
              Peakon revolutionizes project management by providing a secure and
              intuitive platform for teams. Collaborate seamlessly, track tasks
              in real-time, and manage access with ease.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-gray-800 px-6 py-2 rounded hover:bg-gray-100">
                Learn More
              </button>
              <Link to="/login">
                <button className="border border-white px-6 py-2 rounded hover:bg-white hover:text-gray-800">
                  Login{" "}
                </button>
              </Link>
            </div>
          </div>
          {/* Optionnel : tu peux garder un bloc vide pour équilibrer */}
          <div className="flex-1 hidden md:block" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="uppercase text-sm text-gray-500 tracking-wide mb-2">
            Streamlined
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How Peakon Enhances Task Management
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Peakon's real-time task management system allows teams to track
            tasks effortlessly while collaborating seamlessly. With secure
            access control based on user roles, every team member knows their
            responsibilities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center flex flex-col items-center">
                <div className="text-4xl mb-4 flex justify-center">
                  <Box />
                </div>

                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 text-center max-w-xs">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <button className="border border-gray-800 px-6 py-2 rounded hover:bg-gray-100">
              Learn More
            </button>
            <button className="text-gray-800 underline">Login</button>
          </div>
        </div>
      </section>
      <section className=" bg-[#4b6fe7]  mx-2 rounded-3xl">
        {" "}
        <ProjectSlider />
      </section>

      {/*Feature */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto flex gap-20 px-4 bg-gray-50 min-h-[400px]">
          <div className="max-w-xl my-4">
            <img
              src="https://cdn.wedevs.com/uploads/2020/01/Kanban-methodology-its-benefits-project-management-kanban-methodology.png"
              alt="video instead"
            />
          </div>
          <div className="gap-6 flex-row my-4">
            <Badge className="bg-gray-300 text-black">
              Boost your project workflows
            </Badge>
            <h1 className=" text-4xl md:text-5xl font-bold my-6 leading-tight">
              Track progress <br /> and stay aligned <br />
              on every <span className="text-blue-400">project</span>
            </h1>
            <p className="mb-6 text-lg text-gray-800 max-w-xl">
              Manage users, roles, tasks and workflows—all in one place. Empower
              your team with real-time collaboration and project clarity.
            </p>
            <Button className="bg-black rounded-sm text-white mb-6">
              Get Started
            </Button>
            <div className="gap-6 flex text-black">
              <span className="flex gap-2 font-medium text-xs">
                <CircleCheckBig className="w-4 h-4" /> No credit card required
              </span>
              <span className="flex gap-2 font-medium text-xs">
                <CircleCheckBig className="w-4 h-4" />
                Built for real-time teamwork
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Efficient Task Tracking Made Easy",
    text: "Stay updated on task progress with real-time notifications.",
  },
  {
    title: "Seamless Collaboration for Teams",
    text: "Work together effortlessly with integrated communication tools.",
  },
  {
    title: "Secure Access Control Using Roles",
    text: "Ensure that team members have appropriate access based on their roles.",
  },
];
