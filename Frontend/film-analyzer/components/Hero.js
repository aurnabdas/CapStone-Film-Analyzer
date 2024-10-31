"use client"; // This marks the component as a Client Component

import Link from "next/link";
import { useEffect } from "react";

const Hero = () => {
  // Smooth scroll to the next section
  const scrollToNextSection = () => {
    const nextSection = document.getElementById("next-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[url('../public/images/studiolight.jpg')] bg-cover bg-center h-screen text-white body-font flex items-center justify-center relative">
      <div className="container px-5 py-24 mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-[100px] font-bold text-[#D5A036] mb-4">Welcome to the Film Analyzer</h1>
          <p className="text-[24px] leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-white">
            Analyze film performance, audience emotions, and personalized feedback with our advanced tools designed for both studios and users.
          </p>
          <div className="flex mt-6 justify-center">
            <div className="w-16 h-1 rounded-full bg-[#D5A036] inline-flex"></div>
          </div>
        </div>
        <div className="flex justify-center space-x-6">
          <Link href="/review">
            <button className="bg-[#D5A036] text-white px-8 py-3 rounded-lg text-lg hover:bg-yellow-600 transition duration-300">
              Explore Reviews
            </button>
          </Link>
          <Link href="/survey">
            <button className="bg-[#D5A036] text-white px-8 py-3 rounded-lg text-lg hover:bg-yellow-600 transition duration-300">
              Take a Survey
            </button>
          </Link>
        </div>
      </div>
      
      {/* Scroll Down Button
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <button
          onClick={scrollToNextSection}
          className="bg-transparent text-white text-4xl hover:text-[#FFD700] transition duration-300 animate-bounce"
        >
          ↓
        </button>
        <p className="text-white mt-2">Scroll Down</p>
      </div> */}
    </section>
  );
};

export default Hero;