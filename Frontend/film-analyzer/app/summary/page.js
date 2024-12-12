"use client";
import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Gif from "../../components/Gif";
import "../styles/summarystyles.css";

export default function Summary() {
  const [username, setUsername] = useState("");
  const [surveys, setSurveys] = useState([]);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Fetch username from Clerk
  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setUsername(user.emailAddresses[0].emailAddress);
    }
  }, [isLoaded, user]);

  // Fetch surveys from the backend
  useEffect(() => {
    if (username) {
      fetchSurveys();
    }
  }, [username]);

  const fetchSurveys = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user-surveys", {
        method: "GET",
        headers: {
          username: username,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setSurveys(data.user_surveys);
      } else if (response.status === 403) {
        router.push("/");
      } else {
        console.error("Failed to fetch surveys:", response.status);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  if (!isLoaded) {
    return (
      <Gif
        gifSource="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnI1MDVmNHFxZ3Bucm54aW5mcjdkcnoxYjQ5ZXgyNmxicjU3eWRuNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SskdP9VDYtJzIsHiTg/giphy.webp"
        backgroundColor="rgb(153 27 27)"
      />
    );
  }

  return (
    <main
      className="min-h-screen bg-parchment text-gray-800 p-6 pt-20"
      style={{ backgroundColor: "#180009", fontFamily: "Georgia, serif" }}
    >
      <NavBar />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-1 mt-8">
        {surveys.length > 0 ? (
          surveys.map((survey, index) => (
            <div
              key={index}
              className="card"
            >
              {/* Thumbnail or Video */}
              <div className="relative">
                <img
                  className="picture"
                  src={survey.survey.thumbnail_url || "/path/to/default-thumbnail.jpg"}
                  alt={`Thumbnail for ${survey.survey.film_name}`}
                />
                <video
                  className="vid"
                  src={survey.survey.video_url}
                  muted
                  autoPlay
                  loop
                  playsInline
                  onMouseEnter={(e) => {
                    e.target.muted = false; // Unmute video on hover
                    e.target.play(); // Play video on hover
                  }}
                  onMouseLeave={(e) => {
                    e.target.muted = true; // Mute video when not hovered
                    e.target.currentTime = 0; // Reset video to the beginning
                    e.target.pause(); // Pause video when not hovered

                  }}
                ></video>
              </div>

              {/* Survey Details (hidden by default, shown on hover) */}
              <div className="details">
                <h3 className="text-lg font-semibold text-white-800">
                  <a href={`/survey/${survey.survey.survey_id}`}>
                    {survey.survey.film_name}
                  </a>
                </h3>
                <p className="text-gray-600">
                  Survey ID: {survey.survey.survey_id}
                </p>
                <p className="text-gray-600">
                   Responses: {survey.response_count}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No surveys found for this user.</p>
        )}
      </section>
    </main>
  );
}
