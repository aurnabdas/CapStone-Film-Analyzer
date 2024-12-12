"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from "@clerk/nextjs";
import "../globals.css";
import NavBar from '../../components/NavBar';
import { Tab } from '@nextui-org/react';
import Link from 'next/link';
import Gif from "../../components/Gif"
import gif from "../../public/gifs/KlapperIcon.gif"


 function ToDo() {
    const { user, isLoaded } = useUser();
    const [movie, setMovies] = useState([]);
    const [username, setUserName] = useState();
    const [isTimerDone, setIsTimerDone] = useState(false);
    const [forceLoading, setForceLoading] = useState(true);
    
    const checkingUsers = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user.emailAddresses[0].emailAddress)
        });
        
        if (response.ok) {
            const data = await response.json();
            setMovies(data.message)
            
        } else {
            console.error("Failed to fetch questions");
        }
    };

    // Initial fetch of questions on page load
    useEffect(() => {
        if (user?.emailAddresses?.[0]?.emailAddress) {
            console.log("User email:", user.emailAddresses[0].emailAddress);
            checkingUsers();
            setUserName(user.emailAddresses[0].emailAddress)
            
        }
    }, [isLoaded, user]);

    //this was causing me so much issues, i needed this loading statement, for clerk to load in the user object
    // and this had to be put after the useeffect, this issue was resolved from a stack overflow forum: https://stackoverflow.com/questions/55622768/uncaught-invariant-violation-rendered-more-hooks-than-during-the-previous-rende
    useEffect(() => {
        
        const timer = setTimeout(() => {
        console.log("Timer done!");
          setIsTimerDone(true);
          setForceLoading(false);
        }, 2000); 
    
        
        return () => clearTimeout(timer);
      }, []);

    if (forceLoading || !isTimerDone || !isLoaded ) {
        return <Gif
        gifSource= "/gifs/KlapperIcon.gif"
        backgroundColor="rgb(153 27 27)"
        
      />;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-red-900">
            <NavBar/>
          <div className="w-[500px] h-[400px] bg-red-800 text-white rounded-lg shadow-lg p-4 flex flex-col">
            {/* Centered Heading */}
            <h2 className="text-lg font-semibold text-center mb-4">Survey</h2>
            
            {/* Table Content with Scroll if Needed */}
            <div className="flex-grow overflow-y-auto">
              <table className="w-full border-separate border-spacing-y-4">
                <tbody>
                  {movie.map((movieTitle, index) => (
                    <tr key={index} className="bg-[#D5A036] rounded-lg">
                      <td className="px-4 py-2 text-center rounded-lg">
                      <Link href={`/review/${encodeURIComponent(movieTitle)}/${encodeURIComponent(username)}`}>
                          <span className="underline hover:no-underline">{movieTitle}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

export default ToDo;