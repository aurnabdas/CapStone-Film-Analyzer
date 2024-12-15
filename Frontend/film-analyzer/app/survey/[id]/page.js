"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import NavBar from "../../../components/NavBar";
import Gif from "../../../components/Gif";

export default function SurveyDetail({ params }) {
  const { id } = params; // Extract dynamic `id` from the URL
  const [surveyData, setSurveyData] = useState(null);
  const [error, setError] = useState(null);
  const [isTimerDone, setIsTimerDone] = useState(false);
  const [forceLoading, setForceLoading] = useState(true);
  const [isAnswersVisible, setIsAnswersVisible] = useState(false); // For dropdown
  const { user, isLoaded } = useUser();

  const fetchSurveyData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/surveys/${id}`, {
        method: "GET",
      });
      if (response.status === 200) {
        const data = await response.json();
        setSurveyData(data);
      } else {
        setError("Survey not found");
      }
    } catch (err) {
      setError("Error fetching survey data");
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchSurveyData();
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimerDone(true);
      setForceLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!surveyData || forceLoading || !isTimerDone || !isLoaded) {
    return (
      <Gif gifSource="/gifs/KlapperIcon.gif" backgroundColor="rgb(153 27 27)" />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Error: {error}</p>
      </div>
    );
  }

  const { survey, questions, answers } = surveyData;

  return (
    <main className="min-h-screen bg-gray-900 text-white pb-10">
      <NavBar />
      {/* Header Section */}
      <header
        className="relative w-full flex items-center justify-center pt-16" // Added padding-top
        style={{
          height: "150px", // Adjust height to take enough space
          backgroundImage: `url(${survey.thumbnail_url || "/default-bg.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-gold mb-2">
            {survey.film_name}
          </h1>
          {/* <p className="text-gray-300 text-lg">Survey ID: {survey.survey_id}</p> */}
        </div>
      </header>

      {/* Video Section */}
      <section className="flex justify-center mt-10 px-6">
        <div
          className="relative w-full max-w-4xl bg-black rounded-lg shadow-lg overflow-hidden"
          style={{
            aspectRatio: "16/9",
            maxHeight: "500px", // Limits height for vertical videos
          }}
        >
          <video
            controls
            src={survey.video_url}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </section>

      {/* Questions Section */}
      <section className="mt-10 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gold mb-6">Questions</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((q, index) => (
            <li
              key={index}
              className="p-4 bg-[#7E1328] text-white rounded-lg shadow-md border border-gold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_5px_rgba(255,215,0,0.8)]"
            >
              <p className="text-md">{q.question__question_text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Answers Section (Dropdown) */}
      <section className="mt-10 px-6 max-w-5xl mx-auto">
        <div
          className="flex items-center justify-between cursor-pointer bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
          onClick={() => setIsAnswersVisible(!isAnswersVisible)}
        >
          <h2 className="text-3xl font-bold text-gold">Answers</h2>
          <span className="text-gold font-bold text-lg">
            {isAnswersVisible ? "-" : "+"}
          </span>
        </div>
        {isAnswersVisible && (
          <ul className="mt-4 space-y-4 px-4">
            {answers.map((a, index) => (
              <li
                key={index}
                className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
              >
                <p className="text-gray-300 font-semibold md:w-1/2">
                  {a.question__question_text}
                </p>
                <p className="text-white md:w-1/2 mt-2 md:mt-0">{a.answer}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
