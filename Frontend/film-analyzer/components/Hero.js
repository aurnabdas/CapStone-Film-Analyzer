"use client"; // This marks the component as a Client Component

import { useEffect, useState } from "react";
import Link from "next/link";

const Hero = () => {
  const [offsetY, setOffsetY] = useState(0);

  // Track scroll position for parallax effect
  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      className="relative h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/studiolight.jpg')", // Ensure this path matches your file location
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Enables the parallax effect
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-70"></div>
      <div className="container px-5 text-center relative z-10">
        <h1 className="text-[60px] md:text-[100px] font-bold text-[#D5A036] mb-4">
          Welcome to the Film Analyzer
        </h1>
        <p className="text-[18px] md:text-[24px] leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-white">
          Analyze film performance, audience emotions, and personalized feedback
          with our advanced tools designed for both studios and users.
        </p>
        <div className="flex mt-8 justify-center gap-4">
          <Link href="/about">
            <button className="bg-[#D5A036] text-white px-6 py-2 md:px-8 md:py-3 rounded-lg text-sm md:text-lg hover:bg-yellow-600 transition duration-300">
              About Us
            </button>
          </Link>
          {/* <Link href="/survey">
            <button className="bg-[#D5A036] text-white px-6 py-2 md:px-8 md:py-3 rounded-lg text-sm md:text-lg hover:bg-yellow-600 transition duration-300">
              Take a Survey
            </button>
          </Link> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
