"use client";
import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../components/NavBar";
import { useUser } from "@clerk/nextjs";
import Gif from "../../components/Gif"

export default function Review() {
    const [username, setUserName] = useState("");
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (user?.emailAddresses?.[0]?.emailAddress) {
            setUserName(user.emailAddresses[0].emailAddress)
        }
      }, [isLoaded, user]);

      if (!isLoaded) {
        return <Gif
        gifSource="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnI1MDVmNHFxZ3Bucm54aW5mcjdkcnoxYjQ5ZXgyNmxicjU3eWRuNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SskdP9VDYtJzIsHiTg/giphy.webp"
        backgroundColor="rgb(153 27 27)"
      />;
      }
      
    return(
        <main
      className="min-h-screen bg-parchment text-gray-800 p-6 pt-20"
      style={{ backgroundColor: "#f5f5dc", fontFamily: "Georgia, serif" }}
    >
            <NavBar/>
            <div>
            <header className=" text-red-800"> Akshay I Wrote the code for you that gets the username already for you, you will use the username, to get the information from the backend and then display it. Also in the backend check if the user has the STUDIO role otherwise they will not have access to this page, and they should be redirected to another page, do the home page which the route should be just / </header>
            <h3 className=" text-blue-800"> {username} </h3> 
            </div>
            

        </main>
        
    )
}
