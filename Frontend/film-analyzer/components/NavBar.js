"use client"; 
import { useEffect, useState } from "react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { AiOutlineMenu } from "react-icons/ai";
import { Navbar, Link } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

const NavBar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoaded } = useUser();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setUsername(user.emailAddresses[0].emailAddress);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    setIsMounted(true); // Ensure that the component is fully mounted
  }, []);

  const fetchRole = async () => {
    if (!username) return;
    try {
      const response = await fetch("http://127.0.0.1:8000/api/navbar/rolecheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: username }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setRole(data.message);
      } 
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchRole();
    }
  }, [username]);

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
            {/* Conditionally Render Links Based on Role */}
            {role === "studio" && (
              <Link href="/survey" className="text-white hover:text-[#FFD700] transition-colors">
                Create Survey
              </Link>
            )}
            {role === "reviewer" && (
              <Link href="/todo" className="text-white hover:text-[#FFD700] transition-colors">
                Available Surveys
              </Link>
            )}
            {role === "studio" && (
              <Link href="/summary" className="text-white hover:text-[#FFD700] transition-colors">
                Survey Results
              </Link>
            )}
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