import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    title: "Team Organization",
    image: "/1.png",
    color: "#60a6fc",
  },
  {
    title: "Task Tracking",
    image: "/2.png",
    color: "#f08d03",
  },
  {
    title: "Project Planning",
    image: "/3.png",
    color: "#5f6063",
  },
  {
    title: "Time Tracking",
    image: "/4.png",
    color: "#6c5ce7",
  },
  {
    title: "Reporting & Analytics",
    image: "/5.png",
    color: "#f06292",
  },
  {
    title: "Collaboration",
    image: "/images/slider/collaboration.jpg",
    color: "#00b894",
  },
  {
    title: "Automations",
    image: "/images/slider/automation.jpg",
    color: "#fab005",
  },
  {
    title: "Integrations",
    image: "/images/slider/integrations.jpg",
    color: "#0984e3",
  },
  {
    title: "Security & Access",
    image: "/images/slider/security.jpg",
    color: "#2d3436",
  },
];

export default function ProjectSlider() {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 3, spacing: 20 },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 15 },
      },
      "(max-width: 768px)": {
        slides: { perView: 1.2, spacing: 10 },
      },
    },
    created(slider) {
      setInterval(() => {
        slider.next();
      }, 4000);
    },
  });

  return (
    <section className="relative py-16">
      <h2 className="text-3xl  md:text-5xl font-bold mb-16 leading-tight text-center text-white">
        Cover Every Project Need
      </h2>

      {/* Arrows */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100"
      >
        <ArrowLeft className="text-gray-800" />
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100"
      >
        <ArrowRight className="text-gray-800" />
      </button>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="keen-slider overflow-hidden px-6 md:px-12"
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="keen-slider__slide h-[320px] rounded-2xl relative overflow-hidden shadow-md group cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute bottom-5 left-5 z-20">
              <h3 className="text-white text-xl font-semibold drop-shadow-md">
                {slide.title}
              </h3>
              <div
                className="w-12 h-1 rounded-full mt-2"
                style={{ backgroundColor: slide.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
