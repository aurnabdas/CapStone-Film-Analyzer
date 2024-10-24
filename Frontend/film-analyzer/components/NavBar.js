"use client"; 
import { useEffect, useState } from "react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { AiOutlineMenu } from "react-icons/ai";
import { Navbar, Link } from "@nextui-org/react";

const NavBar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure that the component is fully mounted
  }, []);

  return (
    <nav className="bg-[#7E0B20] w-full fixed top-0 left-0 z-50">
      <div className="max-w-screen-xl flex justify-between items-center mx-auto px-6 py-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold text-white">
            Film Analyzer
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-8">
          <Link href="/" className="text-white hover:text-[#FFD700] transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-[#FFD700] transition-colors">
            About
          </Link>
          {isMounted && (
            <SignedIn>
              <Link href="/survey" className="text-white hover:text-[#FFD700] transition-colors">
                Survey
              </Link>
              <Link href="/review" className="text-white hover:text-[#FFD700] transition-colors">
                Review
              </Link>
            </SignedIn>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {isMounted && (
            <>
              {/* User Avatar when Signed In */}
              <SignedIn>
                <UserButton />
              </SignedIn>

              {/* Log In and Sign Up buttons when Signed Out */}
              <SignedOut>
                <Link href="/login">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 hover:text-[#FFD700] transition-colors">
                    Log In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-full ml-4 hover:bg-red-700 hover:text-[#FFD700] transition-colors">
                    Sign Up
                  </button>
                </Link>
              </SignedOut>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;