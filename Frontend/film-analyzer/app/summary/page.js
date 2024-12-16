"use client";

import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Gif from "../../components/Gif";

export default function Summary() {
  const [username, setUsername] = useState("");
  const [surveys, setSurveys] = useState([]);
  const [isTimerDone, setIsTimerDone] = useState(false);
  const [forceLoading, setForceLoading] = useState(true);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimerDone(true);
      setForceLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (forceLoading || !isTimerDone || !isLoaded) {
    return (
      <Gif gifSource="/gifs/KlapperIcon.gif" backgroundColor="rgb(153 27 27)" />
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white pt-[60px]">
      <NavBar />
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold text-gold">Completed Surveys</h1>
        <p className="text-gray-400 text-sm mt-2">
          View your completed surveys and details.
        </p>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {surveys.length > 0 ? (
          surveys.map((survey, index) => (
            <div
              key={index}
              className="relative flex-none w-64 bg-[#7E1328] shadow-lg rounded-lg overflow-hidden border border-gold group transition-all duration-300 transform hover:scale-110 hover:translate-y-[-5px] hover:bg-transparent"
            >
              {/* Thumbnail or Trailer */}
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={
                    survey.survey.thumbnail_url ||
                    "/path/to/default-thumbnail.jpg"
                  }
                  alt={`Thumbnail for ${survey.survey.film_name}`}
                />
                <video
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  src={survey.survey.video_url}
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                ></video>
              </div>

              {/* Survey Details */}
              <div className="p-4 text-white">
                <h3 className="text-lg font-bold text-gold truncate">
                  <a href={`/survey/${survey.survey.survey_id}`}>
                    {survey.survey.film_name}
                  </a>
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  <strong>Survey ID:</strong> {survey.survey.survey_id}
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Responses:</strong> {survey.response_count}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">
            No surveys found for this user.
          </p>
        )}
      </section>
    </main>
  );
}
