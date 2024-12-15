"use client";
import { useEffect, useState } from "react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { AiOutlineMenu } from "react-icons/ai";
import { Navbar, Link } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import logo from "../public/images/LogoWhite.png"

const NavBar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoaded } = useUser();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const router = useRouter();


  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setUsername(user.emailAddresses[0].emailAddress);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    setIsMounted(true); // Ensure that the component is fully mounted
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/moviesearch?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const fetchRole = async () => {
    if (!username) return;
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/navbar/rolecheck",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: username }),
        }
      );

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
      <Link
        href="/"
        className="flex items-center space-x-3 text-white text-2xl font-semibold focus:outline-none"
      >
        Film Analyzer
      </Link>
  
      {/* Navigation Links */}
      <div className="flex justify-center space-x-8">
        <Link
          href="/"
          className="text-white hover:text-[#FFD700] transition-colors focus:outline-none text-large"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-white hover:text-[#FFD700] transition-colors focus:outline-none text-large"
        >
          About
        </Link>
  
        <Menu
        animate={{
          mount: { y: 0 },
          unmount: { y: 25 },
        }}>
          <MenuHandler>
            <div className="text-white hover:text-[#FFD700] transition-colors bg-[#7E0B20] text- focus:outline-none">
              <Button className="text-white hover:text-[#FFD700] transition-colors bg-[#7E0B20] text-large focus:outline-none font-sans font-normal">
                Available Services
              </Button>
            </div>
          </MenuHandler>
          <MenuList className="absolute top-full left-0 z-[1000] mt-2 p-2 bg-[#7E0B20] rounded-lg shadow-md">
            {isMounted && (
              <SignedIn>
                {role === "studio" && (
                  <MenuItem>
                    <Link
                      href="/survey"
                      className="text-white hover:text-[#FFD700] transition-colors focus:outline-none rounded-md px-2 py-1 text-large"
                    >
                      Create Survey
                    </Link>
                  </MenuItem>
                )}
                {role === "reviewer" && (
                  <MenuItem>
                    <Link
                      href="/todo"
                      className="text-white hover:text-[#FFD700] transition-colors focus:outline-none rounded-md px-2 py-1 text-large"
                    >
                      Available Surveys
                    </Link>
                  </MenuItem>
                )}
                {role === "studio" && (
                  <MenuItem>
                    <Link
                      href="/summary"
                      className="text-white hover:text-[#FFD700] transition-colors focus:outline-none rounded-md px-2 py-1 text-large"
                    >
                      Survey Results
                    </Link>
                  </MenuItem>
                )}
              </SignedIn>
            )}
          </MenuList>
        </Menu>

        
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2 py-1 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              placeholder="Search movies..."
            />
            <button
              type="submit"
              className="bg-[#7E0B20] shadow-lg shadow-blue-gray-500/10 text-white px-4 py-2 rounded-md  hover:shadow-[0_2px_0_#450a0a] active:translate-y-1 active:shadow-none transition-all duration-200 font-semibold text-large"
              >
              Search
            </button>
          </form>
      </div>

      
  
      <div className="flex items-center space-x-4">
        {isMounted && (
          <>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link href="/login">
                <button className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 hover:text-[#FFD700] transition-colors focus:outline-none">
                  Log In
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-red-600 text-white px-4 py-2 rounded-full ml-4 hover:bg-red-700 hover:text-[#FFD700] transition-colors focus:outline-none">
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
